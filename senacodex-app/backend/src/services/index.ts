import { query } from '@/config/database';
import { hashPassword, comparePassword } from '@/utils/auth';
import type { IUser } from '@/types';

export async function getUserByEmail(email: string): Promise<IUser | null> {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function getUserById(id: string): Promise<IUser | null> {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  role: string = 'student'
): Promise<IUser> {
  const hashedPassword = await hashPassword(password);
  const result = await query(
    `INSERT INTO users (name, email, password, role) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
}

export async function verifyUserPassword(
  user: IUser,
  password: string
): Promise<boolean> {
  return comparePassword(password, user.password || '');
}

export async function getProjects() {
  const result = await query('SELECT * FROM projects ORDER BY created_at DESC');
  return result.rows;
}

export async function getProjectById(id: string) {
  const result = await query('SELECT * FROM projects WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createProject(projectData: any) {
  const result = await query(
    `INSERT INTO projects (name, description, class, advisor, status, progress, risk, students, team_members)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      projectData.name,
      projectData.description,
      projectData.class,
      projectData.advisor,
      projectData.status || 'Em Andamento',
      projectData.progress || 0,
      projectData.risk || 'Baixo',
      JSON.stringify(projectData.students || []),
      JSON.stringify(projectData.teamMembers || []),
    ]
  );
  return result.rows[0];
}

export async function getActivities() {
  const result = await query(
    'SELECT * FROM activities ORDER BY created_at DESC LIMIT 10'
  );
  return result.rows;
}

export async function getRiskProjects() {
  const result = await query(
    "SELECT * FROM projects WHERE risk IN ('Alto', 'Médio') ORDER BY created_at DESC"
  );
  return result.rows;
}
