-- Script para popular o banco com usuários de exemplo
-- Execute este script após criar as tabelas

-- Senhas criptografadas (use bcrypt com salt rounds = 10)
-- aluno@senac.com.br: Aluno@123
-- professor@senac.com.br: Professor@123  
-- coordenador@senac.com.br: Coordenador@123

-- Inserir usuários de exemplo
INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'João Silva',
    'aluno@senac.com.br',
    '$2b$10$YourHashedPasswordForAluno123',  -- Replace with actual bcrypt hash
    'student',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid(),
    'Maria Santos',
    'professor@senac.com.br',
    '$2b$10$YourHashedPasswordForProfessor123',  -- Replace with actual bcrypt hash
    'teacher',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid(),
    'Carlos Oliveira',
    'coordenador@senac.com.br',
    '$2b$10$YourHashedPasswordForCoordenador123',  -- Replace with actual bcrypt hash
    'coordinator',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

-- Criar projetos de exemplo
INSERT INTO projects (id, name, description, class, advisor, status, risk, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Sistema de Gestão de Inventário',
    'Desenvolvimento de um sistema web para gerenciamento de estoque',
    '2024.1',
    'Maria Santos',
    'Em Andamento',
    'Baixo',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid(),
    'App Mobile de Educação',
    'Aplicativo para facilitar o aprendizado remoto',
    '2024.1',
    'Maria Santos',
    'Em Andamento',
    'Médio',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

-- Para gerar os hashes corretos, use Node.js:
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('Aluno@123', 10));"
