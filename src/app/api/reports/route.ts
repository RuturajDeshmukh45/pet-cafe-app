import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role.name !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate'); // YYYY-MM-DD
    const endDate = searchParams.get('endDate');     // YYYY-MM-DD

    // 1. Basic counts
    const usersCount = await prisma.user.count({ where: { role: { name: 'Customer' } } });
    const petsCount = await prisma.pet.count();
    const menuCount = await prisma.menuItem.count();
    
    // Date filter clause
    const reservationWhere: any = {};
    const orderWhere: any = {};
    const paymentWhere: any = { status: 'Completed' };

    if (startDate && endDate) {
      reservationWhere.date = { gte: startDate, lte: endDate };
      orderWhere.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate + 'T23:59:59.999Z'),
      };
      // We can approximate payment dates based on related order creation
      paymentWhere.order = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate + 'T23:59:59.999Z'),
        }
      };
    }

    const reservationsCount = await prisma.reservation.count({ where: reservationWhere });
    const ordersCount = await prisma.order.count({ where: orderWhere });

    // 2. Revenue calculation
    const completedPayments = await prisma.payment.findMany({
      where: paymentWhere,
      select: { amount: true },
    });
    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

    // 3. Reservations by date (for charts)
    const reservationsList = await prisma.reservation.findMany({
      where: reservationWhere,
      select: { date: true, partySize: true },
    });

    const reservationsByDateMap: Record<string, { count: number; attendees: number }> = {};
    reservationsList.forEach(res => {
      if (!reservationsByDateMap[res.date]) {
        reservationsByDateMap[res.date] = { count: 0, attendees: 0 };
      }
      reservationsByDateMap[res.date].count += 1;
      reservationsByDateMap[res.date].attendees += res.partySize;
    });

    const reservationsByDate = Object.entries(reservationsByDateMap).map(([date, data]) => ({
      date,
      count: data.count,
      attendees: data.attendees,
    })).sort((a, b) => a.date.localeCompare(b.date)).slice(-7); // Last 7 active days

    // 4. Sales by Menu Category
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: orderWhere,
      },
      include: {
        menuItem: { select: { category: true } },
      },
    });

    const salesByCategoryMap: Record<string, number> = {
      'Coffee': 0,
      'Tea': 0,
      'Bakery': 0,
      'Beverage': 0,
    };

    orderItems.forEach(item => {
      const category = item.menuItem?.category || 'Other';
      salesByCategoryMap[category] = (salesByCategoryMap[category] || 0) + item.subtotal;
    });

    const salesByCategory = Object.entries(salesByCategoryMap).map(([category, value]) => ({
      category,
      value: parseFloat(value.toFixed(2)),
    }));

    // 5. Popular Pets distribution (from status or general overview)
    const petsDistribution = await prisma.pet.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const petStatusData = petsDistribution.map(item => ({
      status: item.status,
      count: item._count.id,
    }));

    return NextResponse.json({
      summary: {
        usersCount,
        petsCount,
        menuCount,
        reservationsCount,
        ordersCount,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      },
      reservationsByDate,
      salesByCategory,
      petStatusData,
    });

  } catch (error) {
    console.error('GET reports error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
