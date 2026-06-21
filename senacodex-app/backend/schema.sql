-- SENACODEX Database Schema
-- Execute este arquivo para criar as tabelas automaticamente

-- Criar extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabela de Usuários
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

-- Tabela de Projetos
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

-- Tabela de Versões de Projetos
CREATE TABLE IF NOT EXISTS project_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    submission_date VARCHAR(50) NOT NULL,
    submission_time VARCHAR(50) NOT NULL,
    grade DECIMAL(3,1),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Avaliações
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
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

-- Tabela de Atividades
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    icon VARCHAR(255),
    text TEXT NOT NULL,
    time VARCHAR(50),
    type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_projects_advisor ON projects(advisor);
CREATE INDEX IF NOT EXISTS idx_project_versions_project_id ON project_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_project_id ON evaluations(project_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);

-- Dados de exemplo (comentados - descomente se quiser)
-- INSERT INTO users (name, email, password, role) VALUES 
-- ('Admin', 'admin@example.com', 'hashed_password', 'coordinator'),
-- ('Professor', 'prof@example.com', 'hashed_password', 'teacher'),
-- ('Aluno', 'student@example.com', 'hashed_password', 'student');

-- INSERT INTO projects (name, description, class, advisor, status, progress, risk) VALUES
-- ('App de Delivery', 'Aplicativo voltado para delivery de alimentos', 'T3', 'Prof. Silva', 'Em Andamento', 60, 'Alto'),
-- ('Smart Campus', 'Sistema inteligente para campus universitário', 'T3', 'Prof. Santos', 'Em Andamento', 45, 'Alto'),
-- ('Health Track', 'Rastreamento de saúde e bem-estar', 'T1', 'Prof. Lima', 'Em Revisão', 70, 'Médio');
