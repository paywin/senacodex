import { Pool } from 'pg';
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

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_projects_advisor ON projects(advisor);
    CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
  `);
}

export function isConnectionRefused(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('errors' in error)) {
    return (error as NodeJS.ErrnoException)?.code === 'ECONNREFUSED';
  }

  const { errors } = error as { errors?: unknown[] };
  return errors?.some((err) => (err as NodeJS.ErrnoException).code === 'ECONNREFUSED') ?? false;
}
