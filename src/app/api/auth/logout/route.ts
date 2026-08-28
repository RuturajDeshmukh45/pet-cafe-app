import { NextResponse } from 'next/server';
import { getAuthenticatedUser, createAuditLog } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    
    if (user) {
      await createAuditLog(user.id, 'USER_LOGOUT', 'User', user.id);
    }

    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Expire the cookie
    response.headers.set(
      'Set-Cookie',
      'auth-token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax'
    );
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
