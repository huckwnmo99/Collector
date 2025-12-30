import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';

export interface JwtPayload {
  userId: string;
  username: string;
}

export function createToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export function createAuthCookie(token: string): string {
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  return `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export function createLogoutCookie(): string {
  return 'auth_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}
