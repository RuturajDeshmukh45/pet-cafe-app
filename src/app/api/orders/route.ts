import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthenticatedUser, createAuditLog } from '@/lib/auth';

// GET orders list (Customer sees own, Staff/Admin sees all)
export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let orders;
    if (user.role.name === 'Admin' || user.role.name === 'Staff') {
      orders = await prisma.order.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          reservation: { select: { id: true, date: true, startTime: true } },
          orderItems: {
            include: {
              menuItem: { select: { id: true, name: true, price: true, imageUrl: true } },
            },
          },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      orders = await prisma.order.findMany({
        where: { userId: user.id },
        include: {
          reservation: { select: { id: true, date: true, startTime: true } },
          orderItems: {
            include: {
              menuItem: { select: { id: true, name: true, price: true, imageUrl: true } },
            },
          },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('GET orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create order (Cart checkout)
export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, reservationId, paymentMethod } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 });
    }

    // Server-side calculation of prices to prevent client-side tampered totals!
    let calculatedTotal = 0;
    const orderItemsToCreate: { menuItemId: string; quantity: number; unitPrice: number; subtotal: number }[] = [];

    for (const cartItem of items) {
      const dbItem = await prisma.menuItem.findUnique({
        where: { id: cartItem.menuItemId },
      });

      if (!dbItem) {
        return NextResponse.json({ error: `Menu item with ID ${cartItem.menuItemId} not found` }, { status: 404 });
      }

      if (dbItem.status !== 'Available') {
        return NextResponse.json({ error: `Menu item ${dbItem.name} is currently unavailable` }, { status: 400 });
      }

      const qty = parseInt(cartItem.quantity);
      if (qty <= 0) continue;

      const subtotal = dbItem.price * qty;
      calculatedTotal += subtotal;

      orderItemsToCreate.push({
        menuItemId: dbItem.id,
        quantity: qty,
        unitPrice: dbItem.price,
        subtotal: subtotal,
      });
    }

    if (orderItemsToCreate.length === 0) {
      return NextResponse.json({ error: 'No valid items in order' }, { status: 400 });
    }

    // Add optional mock taxes (e.g. 5% tax)
    const taxAmount = parseFloat((calculatedTotal * 0.05).toFixed(2));
    const finalAmount = calculatedTotal + taxAmount;

    // Use transaction to create Order, OrderItems, and Payment record atomically
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          reservationId: reservationId || null,
          totalAmount: finalAmount,
          status: 'Pending',
          orderItems: {
            create: orderItemsToCreate.map(item => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal,
            })),
          },
        },
      });

      // Create Payment
      const paymentStatus = paymentMethod === 'Online' ? 'Completed' : 'Pending';
      const txnRef = paymentMethod === 'Online' ? `TXN-MOCK-${Math.floor(100000 + Math.random() * 900000)}` : null;

      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          reservationId: reservationId || null,
          amount: finalAmount,
          method: paymentMethod,
          status: paymentStatus,
          transactionRef: txnRef,
        },
      });

      return newOrder;
    });

    await createAuditLog(user.id, 'CREATE_ORDER', 'Order', order.id);

    return NextResponse.json({ message: 'Order placed successfully', order }, { status: 201 });
  } catch (error) {
    console.error('CREATE order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update order status (Staff/Admin only)
export async function PUT(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || (user.role.name !== 'Admin' && user.role.name !== 'Staff')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update status
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

      // If status is served, and payment is pay-at-cafe (Pending), complete the payment!
      if (status === 'Served') {
        await tx.payment.updateMany({
          where: { orderId, status: 'Pending' },
          data: { status: 'Completed', transactionRef: `TXN-CAFE-${Math.floor(100000 + Math.random() * 900000)}` },
        });
      }

      // If status is cancelled, set payment to failed/refunded if completed
      if (status === 'Cancelled') {
        await tx.payment.updateMany({
          where: { orderId, status: 'Completed' },
          data: { status: 'Refunded' },
        });
        await tx.payment.updateMany({
          where: { orderId, status: 'Pending' },
          data: { status: 'Failed' },
        });
      }

      return order;
    });

    await createAuditLog(user.id, `UPDATE_ORDER_STATUS_${status}`, 'Order', orderId);

    return NextResponse.json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('UPDATE order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
