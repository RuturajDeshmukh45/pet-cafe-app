import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

const STANDARD_SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];
const MAX_CAPACITY = 15;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Get all active bookings for that date
    const bookings = await prisma.reservation.findMany({
      where: {
        date,
        status: { in: ['Pending', 'Confirmed'] },
      },
      select: {
        startTime: true,
        partySize: true,
      },
    });

    // Sum capacity per slot
    const bookedCapacities = bookings.reduce((acc: Record<string, number>, booking) => {
      acc[booking.startTime] = (acc[booking.startTime] || 0) + booking.partySize;
      return acc;
    }, {});

    const availability = STANDARD_SLOTS.map(slot => {
      const booked = bookedCapacities[slot] || 0;
      return {
        time: slot,
        booked,
        maxCapacity: MAX_CAPACITY,
        availableSeats: Math.max(0, MAX_CAPACITY - booked),
        isFull: booked >= MAX_CAPACITY,
      };
    });

    return NextResponse.json({ availability });
  } catch (error) {
    console.error('GET availability error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
