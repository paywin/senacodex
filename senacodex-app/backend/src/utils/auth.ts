import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { config } from '@/config';
import type { JwtPayload } from '@/types';

export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  const expiresIn = config.jwt.expiresIn as jwt.SignOptions['expiresIn'];

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn,
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcryptjs.compare(password, hashedPassword);
}
