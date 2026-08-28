import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthenticatedUser, createAuditLog } from '@/lib/auth';

// GET all pets (public)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const species = searchParams.get('species');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const whereClause: any = {};
    if (species && species !== 'All') {
      whereClause.species = species;
    }
    if (status && status !== 'All') {
      whereClause.status = status;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { breed: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const pets = await prisma.pet.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ pets });
  } catch (error) {
    console.error('GET pets error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create pet (Staff/Admin only)
export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || (user.role.name !== 'Admin' && user.role.name !== 'Staff')) {
      return NextResponse.json({ error: 'Unauthorized. Staff or Admin role required.' }, { status: 403 });
    }

    const { name, species, breed, age, description, photoUrl, status, careNotes, restrictions } = await req.json();

    if (!name || !species || !breed || !age || !description || !photoUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed,
        age: parseInt(age),
        description,
        photoUrl,
        status: status || 'Available',
        careNotes: careNotes || null,
        restrictions: restrictions || null,
      },
    });

    await createAuditLog(user.id, 'CREATE_PET', 'Pet', pet.id);

    return NextResponse.json({ message: 'Pet added successfully', pet }, { status: 201 });
  } catch (error) {
    console.error('CREATE pet error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
