import { query } from '@/config/database';
import { comparePassword, hashPassword } from '@/utils/auth';
import { mapUserRow } from '@/utils/format';
import type { IUser } from '@/types';

export async function getUserByEmail(email: string): Promise<IUser | null> {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] ? mapUserRow(result.rows[0]) : null;
}

export async function getUserById(id: string): Promise<IUser | null> {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] ? mapUserRow(result.rows[0]) : null;
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  role = 'student',
): Promise<IUser> {
  const hashedPassword = await hashPassword(password);
  const result = await query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, avatar, created_at, updated_at`,
    [name, email, hashedPassword, role],
  );

  return mapUserRow({ ...result.rows[0], password: hashedPassword });
}

export function verifyUserPassword(user: IUser, password: string): Promise<boolean> {
  return comparePassword(password, user.password || '');
}
