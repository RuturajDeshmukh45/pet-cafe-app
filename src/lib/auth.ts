import crypto from 'crypto';
import prisma from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'pet-cafe-super-secret-key-99881122';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function generateToken(payload: { userId: string; email: string; role: string }): string {
  const data = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64');
  return `${data}.${signature}`;
}

export function verifyToken(token: string): { userId: string; email: string; role: string; exp: number } | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;
    
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64');
    if (signature !== expectedSignature) return null;
    
    const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    if (decoded.exp < Date.now()) return null; // Token expired
    
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getAuthenticatedUser(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => {
        const parts = c.trim().split('=');
        return [parts[0], parts.slice(1).join('=')];
      })
    );
    const token = cookies['auth-token'];
    if (!token) return null;
    
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });
    
    if (!user || user.status !== 'Active') return null;
    return user;
  } catch (e) {
    return null;
  }
}

export async function createAuditLog(userId: string | null, action: string, entityType: string, entityId: string | null) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
      },
    });
  } catch (e) {
    console.error('Failed to create audit log:', e);
  }
}
