import { Pool } from 'pg';
import bcryptjs from 'bcryptjs';
import { config } from '@/config';
import { memoryQuery, seedMemoryDatabase } from '@/config/memoryDatabase';

let pool: Pool | null = null;
let usingMemoryDatabase = false;

export async function initDatabase(): Promise<void> {
  pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  try {
    await createTables();
    await ensureSampleUsers();
    await ensureSampleProjectsAndData();
  } catch (error) {
    if (config.nodeEnv === 'production' || !isConnectionRefused(error)) {
      throw error;
    }

    await pool.end();
    pool = null;
    usingMemoryDatabase = true;
    seedMemoryDatabase();
    console.warn('PostgreSQL indisponivel; usando banco em memoria para desenvolvimento.');
  }
}

export async function getPool(): Promise<Pool> {
  if (!pool) {
    await initDatabase();
  }
  return pool!;
}

export function isUsingMemoryDatabase(): boolean {
  return usingMemoryDatabase;
}

export async function query(text: string, params?: any[]): Promise<any> {
  if (usingMemoryDatabase) {
    return memoryQuery(text, params);
  }

  const p = await getPool();
  return p.query(text, params);
}

async function createTables(): Promise<void> {
  const p = await getPool();

  await p.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'student',
      avatar VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      class VARCHAR(50) NOT NULL,
      advisor VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Em Andamento',
      progress INTEGER DEFAULT 0,
      risk VARCHAR(50) NOT NULL DEFAULT 'Baixo',
      last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      students TEXT,
      team_members TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS project_versions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES projects(id),
      version VARCHAR(50) NOT NULL,
      submission_date VARCHAR(50) NOT NULL,
      submission_time VARCHAR(50) NOT NULL,
      grade DECIMAL(3,1),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS project_files (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_version_id UUID NOT NULL REFERENCES project_versions(id) ON DELETE CASCADE,
      original_name VARCHAR(255) NOT NULL,
      stored_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(255) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      file_size INTEGER NOT NULL,
      checksum VARCHAR(255),
      created_by UUID NOT NULL REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS evaluations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES projects(id),
      project_name VARCHAR(255) NOT NULL,
      methodology DECIMAL(3,1),
      results DECIMAL(3,1),
      originality DECIMAL(3,1),
      formatting DECIMAL(3,1),
      feedback TEXT,
      final_grade DECIMAL(3,1),
      evaluated_by VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id),
      icon VARCHAR(255),
      text TEXT NOT NULL,
      time VARCHAR(50),
      type VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(100) NOT NULL,
      entity_id UUID,
      details TEXT,
      ip_address VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_projects_advisor ON projects(advisor);
    CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
    CREATE INDEX IF NOT EXISTS idx_project_files_version_id ON project_files(project_version_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
  `);
}

async function ensureSampleUsers(): Promise<void> {
  const existing = await query(
    `SELECT email FROM users WHERE email = ANY($1::text[])`,
    [['aluno@senac.com.br', 'professor@senac.com.br', 'coordenador@senac.com.br', 'admin@example.com', 'user@example.com']],
  );

  const existingEmails = new Set(existing.rows.map((row: any) => row.email));
  const usersToSeed = [
    { id: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', name: 'João Silva', email: 'aluno@senac.com.br', password: 'Aluno@123', role: 'student' },
    { id: 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2-b2b2-b2b2-b2b2', name: 'Maria Santos', email: 'professor@senac.com.br', password: 'Professor@123', role: 'teacher' },
    { id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'Carlos Oliveira', email: 'coordenador@senac.com.br', password: 'Coordenador@123', role: 'coordinator' },
    { id: 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', name: 'Admin Demo', email: 'admin@example.com', password: 'Admin123', role: 'coordinator' },
    { id: 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', name: 'User Demo', email: 'user@example.com', password: 'User123', role: 'student' },
  ];

  for (const user of usersToSeed) {
    if (!existingEmails.has(user.email)) {
      const hashedPassword = bcryptjs.hashSync(user.password, 10);
      await query(
        `INSERT INTO users (id, name, email, password, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [user.id, user.name, user.email, hashedPassword, user.role],
      );
    }
  }
}

async function ensureSampleProjectsAndData(): Promise<void> {
  const existingProjects = await query('SELECT id FROM projects LIMIT 1');
  if (existingProjects.rows.length > 0) {
    return;
  }

  const projectsToSeed = [
    {
      id: 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1',
      name: 'Sistema de Gestão de Inventário',
      description: 'Desenvolvimento de um sistema web para gerenciamento de estoque',
      class: '2024.1',
      advisor: 'professor@senac.com.br',
      status: 'Em Andamento',
      progress: 65,
      risk: 'Baixo',
      students: JSON.stringify(['e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1']),
      team_members: JSON.stringify(['João Silva', 'User Demo']),
    },
    {
      id: 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2',
      name: 'App Mobile de Educação',
      description: 'Aplicativo para facilitar o aprendizado remoto',
      class: '2024.1',
      advisor: 'professor@senac.com.br',
      status: 'Em Andamento',
      progress: 45,
      risk: 'Médio',
      students: JSON.stringify(['a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1']),
      team_members: JSON.stringify(['João Silva']),
    },
    {
      id: 'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3',
      name: 'Smart Campus',
      description: 'Sistema inteligente para campus universitário',
      class: '2024.2',
      advisor: 'professor@senac.com.br',
      status: 'Em Andamento',
      progress: 20,
      risk: 'Alto',
      students: JSON.stringify(['e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5']),
      team_members: JSON.stringify(['User Demo']),
    }
  ];

  for (const project of projectsToSeed) {
    await query(
      `INSERT INTO projects (id, name, description, class, advisor, status, progress, risk, students, team_members, last_update, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        project.id,
        project.name,
        project.description,
        project.class,
        project.advisor,
        project.status,
        project.progress,
        project.risk,
        project.students,
        project.team_members,
      ],
    );
  }

  const evaluationsToSeed = [
    {
      id: 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1',
      project_id: 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1',
      project_name: 'Sistema de Gestão de Inventário',
      methodology: 8.5,
      results: 9.0,
      originality: 8.0,
      formatting: 9.5,
      feedback: 'Muito bom desenvolvimento e documentação.',
      final_grade: 8.8,
      evaluated_by: 'professor@senac.com.br',
    },
    {
      id: 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2',
      project_id: 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2',
      project_name: 'App Mobile de Educação',
      methodology: 7.0,
      results: 7.5,
      originality: 7.0,
      formatting: 8.0,
      feedback: 'Bom projeto, mas precisa de ajustes na metodologia.',
      final_grade: 7.4,
      evaluated_by: 'professor@senac.com.br',
    }
  ];

  for (const evalData of evaluationsToSeed) {
    await query(
      `INSERT INTO evaluations (id, project_id, project_name, methodology, results, originality, formatting, feedback, final_grade, evaluated_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)`,
      [
        evalData.id,
        evalData.project_id,
        evalData.project_name,
        evalData.methodology,
        evalData.results,
        evalData.originality,
        evalData.formatting,
        evalData.feedback,
        evalData.final_grade,
        evalData.evaluated_by,
      ],
    );
  }

  const activitiesToSeed = [
    {
      id: 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1',
      user_id: 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5',
      icon: 'fas fa-folder-plus',
      text: 'Criou o projeto Sistema de Gestão de Inventário',
      time: 'há 2 dias',
      type: 'create',
    },
    {
      id: 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d2d2',
      user_id: 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5',
      icon: 'fas fa-upload',
      text: 'Submeteu a versão v1.0.0',
      time: 'há 1 dia',
      type: 'submission',
    }
  ];

  for (const act of activitiesToSeed) {
    await query(
      `INSERT INTO activities (id, user_id, icon, text, time, type, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
      [act.id, act.user_id, act.icon, act.text, act.time, act.type],
    );
  }
}

export function isConnectionRefused(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('errors' in error)) {
    return (error as NodeJS.ErrnoException)?.code === 'ECONNREFUSED';
  }

  const { errors } = error as { errors?: unknown[] };
  return errors?.some((err) => (err as NodeJS.ErrnoException).code === 'ECONNREFUSED') ?? false;
}
