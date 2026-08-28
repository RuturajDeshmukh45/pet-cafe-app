import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthenticatedUser, createAuditLog } from '@/lib/auth';

// GET reviews (Public gets Approved, Admin gets all)
export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    const isAdmin = user && user.role.name === 'Admin';

    let reviews;
    if (isAdmin) {
      reviews = await prisma.review.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          reservation: { select: { id: true, date: true, startTime: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      reviews = await prisma.review.findMany({
        where: { status: 'Approved' },
        include: {
          user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('GET reviews error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create review (Customer only)
export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rating, comment, reservationId } = await req.json();

    if (rating === undefined || !comment) {
      return NextResponse.json({ error: 'Rating and comment are required' }, { status: 400 });
    }

    const rate = parseInt(rating);
    if (rate < 1 || rate > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Optional check: Did this user have a reservation?
    if (reservationId) {
      const res = await prisma.reservation.findUnique({
        where: { id: reservationId },
      });
      if (!res || res.userId !== user.id) {
        return NextResponse.json({ error: 'Invalid reservation association' }, { status: 400 });
      }
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        reservationId: reservationId || null,
        rating: rate,
        comment,
        status: 'Approved', // Auto-approved by default for simple workflow, but moderateable
      },
    });

    await createAuditLog(user.id, 'CREATE_REVIEW', 'Review', review.id);

    return NextResponse.json({ message: 'Review submitted successfully', review }, { status: 201 });
  } catch (error) {
    console.error('CREATE review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT moderate review (Admin only)
export async function PUT(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role.name !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const { reviewId, status } = await req.json();

    if (!reviewId || !status) {
      return NextResponse.json({ error: 'Review ID and status are required' }, { status: 400 });
    }

    if (!['Pending', 'Approved', 'Hidden'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    });

    await createAuditLog(user.id, `MODERATE_REVIEW_${status}`, 'Review', reviewId);

    return NextResponse.json({ message: `Review status updated to ${status}`, review });
  } catch (error) {
    console.error('MODERATE review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
