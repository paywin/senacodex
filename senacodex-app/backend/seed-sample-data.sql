-- Script para popular o banco com usuários de exemplo
-- Execute este script após criar as tabelas

-- Senhas de teste correspondentes aos hashes:
-- aluno@senac.com.br: Aluno@123
-- professor@senac.com.br: Professor@123  
-- coordenador@senac.com.br: Coordenador@123
-- admin@example.com: Admin123
-- user@example.com: User123

-- Inserir usuários de exemplo com IDs estáticos para relacionamentos consistentes
INSERT INTO users (id, name, email, password, role, created_at, updated_at)
VALUES
  (
    'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
    'João Silva',
    'aluno@senac.com.br',
    '$2a$10$X.LFXs6fGk1iMej3n8qJuOGwpSXoVRXGaI/m0Qjr.aw7LPfUJs.ca',
    'student',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2',
    'Maria Santos',
    'professor@senac.com.br',
    '$2a$10$JTzz70.O2WZGcMevEHXRYe.RmaVpgnBqIKcN5W87kDIuJ9cmE2N6.',
    'teacher',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3',
    'Carlos Oliveira',
    'coordenador@senac.com.br',
    '$2a$10$kAImS5pg.KMHg502WzD23u.KFzaTU7yAYL0AXSegeHMD2kqmSHHI2',
    'coordinator',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4',
    'Admin Demo',
    'admin@example.com',
    '$2a$10$O64VD/oDIiXM3PVyWoZyRu9kjsvj/QnWVYmFdUzZz8QraHzfyTlBi',
    'coordinator',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5',
    'User Demo',
    'user@example.com',
    '$2a$10$DHAqbAdXRLD3Q2fWZB923.ReEety20AyYqs8pFlXdjaOALzHDBj5W',
    'student',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

-- Criar projetos de exemplo
-- Os alunos e o professor devem corresponder aos dados inseridos acima
INSERT INTO projects (id, name, description, class, advisor, status, progress, risk, students, team_members, created_at, updated_at)
VALUES
  (
    'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1',
    'Sistema de Gestão de Inventário',
    'Desenvolvimento de um sistema web para gerenciamento de estoque',
    '2024.1',
    'professor@senac.com.br',
    'Em Andamento',
    65,
    'Baixo',
    '["e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5", "a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1"]',
    '["João Silva", "User Demo"]',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2',
    'App Mobile de Educação',
    'Aplicativo para facilitar o aprendizado remoto',
    '2024.1',
    'professor@senac.com.br',
    'Em Andamento',
    45,
    'Médio',
    '["a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1"]',
    '["João Silva"]',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3',
    'Smart Campus',
    'Sistema inteligente para campus universitário',
    '2024.2',
    'professor@senac.com.br',
    'Em Andamento',
    20,
    'Alto',
    '["e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5"]',
    '["User Demo"]',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

-- Criar avaliações de exemplo
INSERT INTO evaluations (id, project_id, project_name, methodology, results, originality, formatting, feedback, final_grade, evaluated_by, created_at)
VALUES
  (
    'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1',
    'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1',
    'Sistema de Gestão de Inventário',
    8.5,
    9.0,
    8.0,
    9.5,
    'Muito bom desenvolvimento e documentação.',
    8.8,
    'professor@senac.com.br',
    CURRENT_TIMESTAMP
  ),
  (
    'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2',
    'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2',
    'App Mobile de Educação',
    7.0,
    7.5,
    7.0,
    8.0,
    'Bom projeto, mas precisa de ajustes na metodologia.',
    7.4,
    'professor@senac.com.br',
    CURRENT_TIMESTAMP
  );

-- Criar atividades de exemplo
INSERT INTO activities (id, user_id, icon, text, time, type, created_at)
VALUES
  (
    'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1',
    'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5',
    'fas fa-folder-plus',
    'Criou o projeto Sistema de Gestão de Inventário',
    'há 2 dias',
    'create',
    CURRENT_TIMESTAMP
  ),
  (
    'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d2d2',
    'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5',
    'fas fa-upload',
    'Submeteu a versão v1.0.0',
    'há 1 dia',
    'submission',
    CURRENT_TIMESTAMP
  );
