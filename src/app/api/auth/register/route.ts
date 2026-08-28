import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, roleName } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const emailParts = email.split('@');
    if (emailParts.length !== 2 || emailParts[1] !== 'gmail.com') {
      return NextResponse.json({ error: 'Email address must end exactly with @gmail.com' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Determine target role (default to Customer)
    const targetRoleName = roleName || 'Customer';
    let role = await prisma.role.findFirst({
      where: { name: targetRoleName },
    });

    // If role doesn't exist, create it (fallback)
    if (!role) {
      role = await prisma.role.create({
        data: { name: targetRoleName },
      });
    }

    const passwordHash = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        roleId: role.id,
        status: 'Active',
      },
      include: {
        role: true,
      },
    });

    return NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
