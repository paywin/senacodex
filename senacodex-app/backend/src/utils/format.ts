import type { IActivity, IEvaluation, IProject, IUser } from '@/types';

export function parseJsonArray<T>(value: unknown): T[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T[];
    } catch {
      return [];
    }
  }

  return [];
}

export function mapUserRow(row: any): IUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
    avatar: row.avatar ?? undefined,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
  };
}

export function mapProjectRow(row: any): IProject {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    class: row.class,
    advisor: row.advisor,
    status: row.status,
    progress: Number(row.progress) || 0,
    risk: row.risk,
    lastUpdate: row.last_update ? new Date(row.last_update).toISOString() : '',
    students: parseJsonArray<string>(row.students),
    teamMembers: parseJsonArray<string>(row.team_members),
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
  };
}

export function mapActivityRow(row: any): IActivity {
  return {
    id: row.id,
    userId: row.user_id,
    icon: row.icon,
    text: row.text,
    time: row.time,
    type: row.type,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  };
}

export function mapEvaluationRow(row: any): IEvaluation {
  return {
    id: row.id,
    projectId: row.project_id,
    projectName: row.project_name,
    methodology: row.methodology !== null ? Number(row.methodology) : 0,
    results: row.results !== null ? Number(row.results) : 0,
    originality: row.originality !== null ? Number(row.originality) : 0,
    formatting: row.formatting !== null ? Number(row.formatting) : 0,
    feedback: row.feedback,
    finalGrade: row.final_grade !== null ? Number(row.final_grade) : undefined,
    evaluatedBy: row.evaluated_by,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  };
}
