import { query } from '@/config/database';
import { mapProjectRow, mapEvaluationRow, mapActivityRow } from '@/utils/format';
import type { IProject, IEvaluation, IActivity } from '@/types';

/**
 * Serviços de dados baseados em role do usuário
 * Filtra dados conforme o tipo de acesso (student, teacher, coordinator)
 */

// ==================== ALUNO (STUDENT) ====================

export async function getStudentProjects(studentId: string): Promise<IProject[]> {
  // Busca projetos onde o aluno está registrado
  const result = await query(
    `SELECT * FROM projects WHERE students LIKE $1 ORDER BY created_at DESC`,
    [`%${studentId}%`],
  );
  return result.rows.map(mapProjectRow);
}

export async function getStudentProjectById(projectId: string, studentId: string): Promise<IProject | null> {
  const result = await query(
    `SELECT * FROM projects WHERE id = $1 AND students LIKE $2`,
    [projectId, `%${studentId}%`],
  );
  return result.rows[0] ? mapProjectRow(result.rows[0]) : null;
}

export async function getStudentEvaluations(studentId: string): Promise<IEvaluation[]> {
  // Avaliações dos projetos do aluno
  const result = await query(
    `SELECT e.* FROM evaluations e
     INNER JOIN projects p ON e.project_id = p.id
     WHERE p.students LIKE $1
     ORDER BY e.created_at DESC`,
    [`%${studentId}%`],
  );
  return result.rows.map(mapEvaluationRow);
}

export async function getStudentActivities(studentId: string): Promise<IActivity[]> {
  const result = await query(
    `SELECT * FROM activities WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
    [studentId],
  );
  return result.rows.map(mapActivityRow);
}

export async function getStudentStats(studentId: string): Promise<any> {
  const projects = await getStudentProjects(studentId);
  const evaluations = await getStudentEvaluations(studentId);
  
  return {
    totalProjects: projects.length,
    projectsInProgress: projects.filter((p) => p.status === 'Em Andamento').length,
    projectsUnderReview: projects.filter((p) => p.status === 'Em Revisão').length,
    projectsCompleted: projects.filter((p) => p.status === 'Concluído').length,
    evaluationsReceived: evaluations.length,
    averageGrade: evaluations.length > 0 
      ? (evaluations.reduce((sum, e) => sum + (e.finalGrade || 0), 0) / evaluations.length).toFixed(1)
      : 0,
  };
}

// ==================== PROFESSOR (TEACHER) ====================

export async function getTeacherProjectsByClass(professorEmail: string, classCode?: string): Promise<IProject[]> {
  // Projetos da turma do professor
  if (classCode) {
    const result = await query(
      `SELECT * FROM projects WHERE advisor = $1 AND class = $2 ORDER BY created_at DESC`,
      [professorEmail, classCode],
    );
    return result.rows.map(mapProjectRow);
  }
  
  const result = await query(
    `SELECT * FROM projects WHERE advisor = $1 ORDER BY created_at DESC`,
    [professorEmail],
  );
  return result.rows.map(mapProjectRow);
}

export async function getTeacherStats(professorEmail: string): Promise<any> {
  const projectsResult = await query(
    `SELECT * FROM projects WHERE advisor = $1`,
    [professorEmail],
  );
  const projects: IProject[] = projectsResult.rows.map(mapProjectRow);
  
  const evaluationsResult = await query(
    `SELECT e.* FROM evaluations e
     INNER JOIN projects p ON e.project_id = p.id
     WHERE p.advisor = $1`,
    [professorEmail],
  );
  const evaluations = evaluationsResult.rows.map(mapEvaluationRow);

  return {
    totalProjects: projects.length,
    projectsAtRisk: projects.filter((p) => p.risk === 'Alto').length,
    projectsInProgress: projects.filter((p) => p.status === 'Em Andamento').length,
    evaluationsPending: projects.length - evaluations.length,
    evaluationsCompleted: evaluations.length,
  };
}

export async function getTeacherRiskProjects(professorEmail: string): Promise<IProject[]> {
  const result = await query(
    `SELECT * FROM projects WHERE advisor = $1 AND risk IN ('Alto', 'Médio') ORDER BY risk DESC, created_at DESC`,
    [professorEmail],
  );
  return result.rows.map(mapProjectRow);
}

// ==================== COORDENADOR (COORDINATOR) ====================

export async function getCoordinatorStats(): Promise<any> {
  const projectsResult = await query(`SELECT * FROM projects`);
  const projects: IProject[] = projectsResult.rows.map(mapProjectRow);
  
  const evaluationsResult = await query(`SELECT * FROM evaluations`);
  const evaluations = evaluationsResult.rows.map(mapEvaluationRow);

  const classStats = projects.reduce((acc: any, project: IProject) => {
    acc[project.class] = (acc[project.class] || 0) + 1;
    return acc;
  }, {});

  const statusStats = {
    excellent: projects.filter((p) => p.progress >= 80).length,
    good: projects.filter((p) => p.progress >= 60 && p.progress < 80).length,
    medium: projects.filter((p) => p.progress >= 40 && p.progress < 60).length,
    low: projects.filter((p) => p.progress < 40).length,
  };

  return {
    totalProjects: projects.length,
    totalClasses: Object.keys(classStats).length,
    classStats,
    statusStats,
    evaluationsCompleted: evaluations.length,
  };
}

export async function getCoordinatorTeacherStats(): Promise<any> {
  // Estatísticas por professor
  const result = await query(
    `SELECT advisor, COUNT(*) as total_projects, 
            SUM(CASE WHEN risk = 'Alto' THEN 1 ELSE 0 END) as projects_at_risk,
            SUM(CASE WHEN status = 'Em Andamento' THEN 1 ELSE 0 END) as in_progress
     FROM projects GROUP BY advisor ORDER BY total_projects DESC`,
  );
  return result.rows;
}

export async function getCoordinatorClassStatus(classCode: string): Promise<any> {
  const result = await query(
    `SELECT * FROM projects WHERE class = $1 ORDER BY progress DESC`,
    [classCode],
  );
  const projects: IProject[] = result.rows.map(mapProjectRow);

  return {
    classCode,
    totalProjects: projects.length,
    statusBreakdown: {
      excellent: projects.filter((p) => p.progress >= 80).length,
      good: projects.filter((p) => p.progress >= 60 && p.progress < 80).length,
      medium: projects.filter((p) => p.progress >= 40 && p.progress < 60).length,
      low: projects.filter((p) => p.progress < 40).length,
    },
    riskBreakdown: {
      high: projects.filter((p) => p.risk === 'Alto').length,
      medium: projects.filter((p) => p.risk === 'Médio').length,
      low: projects.filter((p) => p.risk === 'Baixo').length,
    },
    projects: projects.map((p) => ({
      id: p.id,
      name: p.name,
      advisor: p.advisor,
      progress: p.progress,
      risk: p.risk,
      status: p.status,
    })),
  };
}

export async function getCoordinatorTeacherEvaluations(professorEmail: string): Promise<IEvaluation[]> {
  const result = await query(
    `SELECT e.* FROM evaluations e
     INNER JOIN projects p ON e.project_id = p.id
     WHERE p.advisor = $1
     ORDER BY e.created_at DESC`,
    [professorEmail],
  );
  return result.rows.map(mapEvaluationRow);
}
