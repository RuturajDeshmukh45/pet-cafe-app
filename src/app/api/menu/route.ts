import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthenticatedUser, createAuditLog } from '@/lib/auth';

// GET all menu items (public)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const whereClause: any = {};
    if (category && category !== 'All') {
      whereClause.category = category;
    }
    if (status && status !== 'All') {
      whereClause.status = status;
    }

    const menuItems = await prisma.menuItem.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ menuItems });
  } catch (error) {
    console.error('GET menu items error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create menu item (Staff/Admin only)
export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || (user.role.name !== 'Admin' && user.role.name !== 'Staff')) {
      return NextResponse.json({ error: 'Unauthorized. Staff or Admin role required.' }, { status: 403 });
    }

    const { name, category, description, price, imageUrl, status } = await req.json();

    if (!name || !category || !description || price === undefined || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        category,
        description,
        price: parseFloat(price),
        imageUrl,
        status: status || 'Available',
      },
    });

    await createAuditLog(user.id, 'CREATE_MENU_ITEM', 'MenuItem', menuItem.id);

    return NextResponse.json({ message: 'Menu item created successfully', menuItem }, { status: 201 });
  } catch (error) {
    console.error('CREATE menu item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
