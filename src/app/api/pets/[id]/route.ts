import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthenticatedUser, createAuditLog } from '@/lib/auth';

// GET a single pet (public)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }

    return NextResponse.json({ pet });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update pet (Staff/Admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(req);
    if (!user || (user.role.name !== 'Admin' && user.role.name !== 'Staff')) {
      return NextResponse.json({ error: 'Unauthorized. Staff or Admin role required.' }, { status: 403 });
    }

    const body = await req.json();
    const existingPet = await prisma.pet.findUnique({ where: { id } });

    if (!existingPet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }

    // Convert age to number if it's passed
    const dataToUpdate: any = { ...body };
    if (body.age !== undefined) {
      dataToUpdate.age = parseInt(body.age);
    }

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: dataToUpdate,
    });

    await createAuditLog(user.id, 'UPDATE_PET', 'Pet', id);

    return NextResponse.json({ message: 'Pet updated successfully', pet: updatedPet });
  } catch (error) {
    console.error('UPDATE pet error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE pet (Admin only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(req);
    if (!user || user.role.name !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const existingPet = await prisma.pet.findUnique({ where: { id } });

    if (!existingPet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }

    await prisma.pet.delete({
      where: { id },
    });

    await createAuditLog(user.id, 'DELETE_PET', 'Pet', id);

    return NextResponse.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('DELETE pet error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
