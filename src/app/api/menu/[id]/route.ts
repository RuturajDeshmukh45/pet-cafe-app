import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthenticatedUser, createAuditLog } from '@/lib/auth';

// GET a single menu item (public)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json({ menuItem });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update menu item (Staff/Admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(req);
    if (!user || (user.role.name !== 'Admin' && user.role.name !== 'Staff')) {
      return NextResponse.json({ error: 'Unauthorized. Staff or Admin role required.' }, { status: 403 });
    }

    const body = await req.json();
    const existingItem = await prisma.menuItem.findUnique({ where: { id } });

    if (!existingItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    const dataToUpdate: any = { ...body };
    if (body.price !== undefined) {
      dataToUpdate.price = parseFloat(body.price);
    }

    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: dataToUpdate,
    });

    await createAuditLog(user.id, 'UPDATE_MENU_ITEM', 'MenuItem', id);

    return NextResponse.json({ message: 'Menu item updated successfully', menuItem: updatedItem });
  } catch (error) {
    console.error('UPDATE menu item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE menu item (Admin only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(req);
    if (!user || user.role.name !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const existingItem = await prisma.menuItem.findUnique({ where: { id } });

    if (!existingItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    await createAuditLog(user.id, 'DELETE_MENU_ITEM', 'MenuItem', id);

    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('DELETE menu item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
