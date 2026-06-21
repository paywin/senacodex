import { query } from '@/config/database';
import { mapProjectRow } from '@/utils/format';
import type { IProject } from '@/types';

export async function getProjects(): Promise<IProject[]> {
  const result = await query('SELECT * FROM projects ORDER BY created_at DESC');
  return result.rows.map(mapProjectRow);
}

export async function getProjectById(id: string): Promise<IProject | null> {
  const result = await query('SELECT * FROM projects WHERE id = $1', [id]);
  return result.rows[0] ? mapProjectRow(result.rows[0]) : null;
}

export async function createProject(projectData: any): Promise<IProject> {
  const result = await query(
    `INSERT INTO projects (name, description, class, advisor, status, progress, risk, students, team_members)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      projectData.name,
      projectData.description || null,
      projectData.class,
      projectData.advisor,
      projectData.status || 'Em Andamento',
      projectData.progress || 0,
      projectData.risk || 'Baixo',
      JSON.stringify(projectData.students || []),
      JSON.stringify(projectData.teamMembers || []),
    ],
  );

  return mapProjectRow(result.rows[0]);
}

export async function getRiskProjects(): Promise<IProject[]> {
  const result = await query(
    "SELECT * FROM projects WHERE risk IN ('Alto', 'Médio') ORDER BY created_at DESC",
  );
  return result.rows.map(mapProjectRow);
}
