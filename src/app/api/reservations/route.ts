import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthenticatedUser, createAuditLog } from '@/lib/auth';

const MAX_CAPACITY_PER_SLOT = 15; // Café capacity per time slot

// GET reservations list (Customer sees own, Staff/Admin sees all)
export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let reservations;
    if (user.role.name === 'Admin' || user.role.name === 'Staff') {
      reservations = await prisma.reservation.findMany({
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          orders: { select: { id: true, totalAmount: true, status: true } },
        },
        orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
      });
    } else {
      reservations = await prisma.reservation.findMany({
        where: { userId: user.id },
        include: {
          orders: { select: { id: true, totalAmount: true, status: true } },
        },
        orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
      });
    }

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('GET reservations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create reservation (Customer or Staff/Admin on behalf)
export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date, startTime, partySize, notes, targetUserId } = await req.json();

    if (!date || !startTime || !partySize) {
      return NextResponse.json({ error: 'Date, start time, and party size are required' }, { status: 400 });
    }

    const pSize = parseInt(partySize);
    if (pSize <= 0) {
      return NextResponse.json({ error: 'Party size must be greater than 0' }, { status: 400 });
    }

    // Determine booking user
    let bookingUserId = user.id;
    if (targetUserId && (user.role.name === 'Admin' || user.role.name === 'Staff')) {
      bookingUserId = targetUserId;
    }

    // Validate date is not in the past
    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      return NextResponse.json({ error: 'Cannot book in the past' }, { status: 400 });
    }

    // Capacity Check
    const activeBookings = await prisma.reservation.findMany({
      where: {
        date,
        startTime,
        status: { in: ['Pending', 'Confirmed'] },
      },
    });

    const currentBookedCount = activeBookings.reduce((sum, res) => sum + res.partySize, 0);

    if (currentBookedCount + pSize > MAX_CAPACITY_PER_SLOT) {
      return NextResponse.json(
        {
          error: `Capacity exceeded. Only ${MAX_CAPACITY_PER_SLOT - currentBookedCount} spots remaining for ${startTime}.`,
        },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId: bookingUserId,
        date,
        startTime,
        partySize: pSize,
        notes: notes || null,
        status: 'Pending', // default
      },
    });

    await createAuditLog(user.id, 'CREATE_RESERVATION', 'Reservation', reservation.id);

    return NextResponse.json({ message: 'Reservation booked successfully', reservation }, { status: 201 });
  } catch (error) {
    console.error('CREATE reservation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT batch updates / status updates (Staff/Admin/Customer cancel)
export async function PUT(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reservationId, status, notes, date, startTime, partySize } = await req.json();

    if (!reservationId) {
      return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    // Check permissions
    const isStaffOrAdmin = user.role.name === 'Admin' || user.role.name === 'Staff';
    const isOwner = reservation.userId === user.id;

    if (!isStaffOrAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prepare update payload
    const updateData: any = {};

    if (status) {
      // Customers can only cancel their own reservations
      if (!isStaffOrAdmin && status !== 'Cancelled') {
        return NextResponse.json({ error: 'Only staff can confirm/reject reservations' }, { status: 403 });
      }
      updateData.status = status;
    }

    if (notes !== undefined && isStaffOrAdmin) {
      updateData.notes = notes;
    }

    // Staff/Admin can change reservation details (date, time, partySize)
    if (isStaffOrAdmin) {
      if (date) updateData.date = date;
      if (startTime) updateData.startTime = startTime;
      if (partySize) updateData.partySize = parseInt(partySize);
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: updateData,
    });

    await createAuditLog(user.id, `UPDATE_RESERVATION_STATUS_${status || 'INFO'}`, 'Reservation', reservationId);

    return NextResponse.json({ message: 'Reservation updated successfully', reservation: updatedReservation });
  } catch (error) {
    console.error('UPDATE reservation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
