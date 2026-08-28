import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthenticatedUser, createAuditLog } from '@/lib/auth';

// GET all users (Admin only)
export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role.name !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Remove sensitive password hashes before returning
    const safeUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role.name,
      status: u.status,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ users: safeUsers });
  } catch (error) {
    console.error('GET users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update user status/role (Admin only)
export async function PUT(req: Request) {
  try {
    const admin = await getAuthenticatedUser(req);
    if (!admin || admin.role.name !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const { userId, status, roleName } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent self-deactivation or self-role change to maintain system access
    if (userId === admin.id) {
      return NextResponse.json({ error: 'Admins cannot modify their own status or role' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const dataToUpdate: any = {};
    if (status) {
      if (!['Active', 'Inactive'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
      }
      dataToUpdate.status = status;
    }

    if (roleName) {
      const role = await prisma.role.findFirst({
        where: { name: roleName },
      });
      if (!role) {
        return NextResponse.json({ error: `Role ${roleName} does not exist` }, { status: 400 });
      }
      dataToUpdate.roleId = role.id;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      include: { role: true },
    });

    await createAuditLog(
      admin.id,
      `ADMIN_UPDATE_USER_${status ? 'STATUS_' + status : ''}${roleName ? '_ROLE_' + roleName : ''}`,
      'User',
      userId
    );

    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role.name,
        status: updatedUser.status,
      },
    });

  } catch (error) {
    console.error('UPDATE user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
