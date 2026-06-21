import { Pool, PoolClient } from 'pg';
import { config } from '@/config';

let pool: Pool | null = null;

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

  // Create tables if they don't exist
  await createTables();
}

export async function getPool(): Promise<Pool> {
  if (!pool) {
    await initDatabase();
  }
  return pool!;
}

export async function query(text: string, params?: any[]): Promise<any> {
  const p = await getPool();
  return p.query(text, params);
}

export async function getClient(): Promise<PoolClient> {
  const p = await getPool();
  return p.connect();
}

async function createTables(): Promise<void> {
  const p = await getPool();

  await p.query(`
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

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
  }
}
