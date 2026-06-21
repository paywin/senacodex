# 🧪 Guia de Testes - Sistema de Controle de Acesso por Role

## 📝 Pré-requisitos

1. Node.js 18+ instalado
2. PostgreSQL rodando e configurado
3. Repositório clonado
4. Dependências instaladas (`npm install` em backend e frontend)

---

## 🔍 Teste 1: Verificar Middleware de Autorização

### Objetivo
Validar que o middleware bloqueia requisições sem token e de usuários com role não autorizada.

### Passos

```bash
# 1. Tente acessar endpoint protegido SEM token
curl -X GET http://localhost:3001/api/role-dashboard/stats

# Esperado: 401 Unauthorized
# Resposta: { "message": "Token não fornecido" }

# 2. Tente acessar com token inválido
curl -X GET http://localhost:3001/api/role-dashboard/stats \
  -H "Authorization: Bearer TOKEN_INVALIDO"

# Esperado: 401 Unauthorized
# Resposta: { "message": "Token inválido ou expirado" }
```

---

## 🔍 Teste 2: Dashboard por Role

### Objetivo
Validar que cada role vê dados diferentes.

### Preparação

Certifique-se de ter esses usuários no banco:

```sql
-- Aluno
INSERT INTO users (name, email, password, role) VALUES 
('João Silva', 'joao@example.com', '$2b$10$...', 'student');

-- Professor
INSERT INTO users (name, email, password, role) VALUES 
('Maria Santos', 'maria@example.com', '$2b$10$...', 'teacher');

-- Coordenador
INSERT INTO users (name, email, password, role) VALUES 
('Carlos Admin', 'carlos@example.com', '$2b$10$...', 'coordinator');
```

### Teste para Aluno

```bash
# 1. Login como aluno
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'

# Salve o TOKEN na resposta

# 2. Obter dashboard
curl -X GET http://localhost:3001/api/role-dashboard/stats \
  -H "Authorization: Bearer TOKEN"

# Esperado: Estatísticas do ALUNO
# {
#   "stats": {
#     "totalProjects": X,
#     "projectsInProgress": X,
#     "evaluationsReceived": X,
#     "averageGrade": X
#   },
#   "role": "student"
# }
```

### Teste para Professor

```bash
# 1. Login como professor
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "123456"
  }'

# Salve o TOKEN

# 2. Obter dashboard
curl -X GET http://localhost:3001/api/role-dashboard/stats \
  -H "Authorization: Bearer TOKEN"

# Esperado: Estatísticas do PROFESSOR
# {
#   "stats": {
#     "totalProjects": X,
#     "projectsAtRisk": X,
#     "projectsInProgress": X,
#     "evaluationsPending": X
#   },
#   "role": "teacher"
# }
```

### Teste para Coordenador

```bash
# 1. Login como coordenador
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "carlos@example.com",
    "password": "123456"
  }'

# Salve o TOKEN

# 2. Obter dashboard
curl -X GET http://localhost:3001/api/role-dashboard/stats \
  -H "Authorization: Bearer TOKEN"

# Esperado: Estatísticas GERAIS
# {
#   "stats": {
#     "totalProjects": X,
#     "totalClasses": X,
#     "statusStats": {
#       "excellent": X,
#       "good": X,
#       "medium": X,
#       "low": X
#     }
#   },
#   "role": "coordinator"
# }
```

---

## 🔍 Teste 3: Filtro de Dados por Role

### Objetivo
Validar que cada role vê apenas seus dados.

### Teste: Aluno vê apenas seus projetos

```bash
# 1. Como ALUNO, obter projetos
curl -X GET http://localhost:3001/api/role-dashboard/projects \
  -H "Authorization: Bearer TOKEN_ALUNO"

# Esperado: APENAS projetos onde aluno está participando

# 2. Como PROFESSOR, obter projetos
curl -X GET http://localhost:3001/api/role-dashboard/projects \
  -H "Authorization: Bearer TOKEN_PROFESSOR"

# Esperado: TODOS projetos da turma do professor

# 3. Como COORDENADOR, obter projetos
curl -X GET http://localhost:3001/api/role-dashboard/projects \
  -H "Authorization: Bearer TOKEN_COORDENADOR"

# Esperado: TODOS projetos
```

---

## 🔍 Teste 4: Middleware de Role

### Objetivo
Validar que rotas específicas só permitem certos roles.

### Teste: Apenas Coordenador acessa

```bash
# 1. Tente como ALUNO
curl -X GET http://localhost:3001/api/role-dashboard/teachers/performance \
  -H "Authorization: Bearer TOKEN_ALUNO"

# Esperado: 403 Forbidden
# { "message": "Acesso negado. Você não tem permissão para acessar este recurso." }

# 2. Tente como PROFESSOR
curl -X GET http://localhost:3001/api/role-dashboard/teachers/performance \
  -H "Authorization: Bearer TOKEN_PROFESSOR"

# Esperado: 403 Forbidden

# 3. Tente como COORDENADOR
curl -X GET http://localhost:3001/api/role-dashboard/teachers/performance \
  -H "Authorization: Bearer TOKEN_COORDENADOR"

# Esperado: 200 OK
# [{ advisor, total_projects, projects_at_risk, in_progress }, ...]
```

---

## 🔍 Teste 5: Frontend - Navegação Dinâmica

### Objetivo
Validar que cada role vê menu diferente.

### Passos

1. **Abra o navegador** em `http://localhost:5173`

2. **Login como Aluno**
   - Email: `joao@example.com`
   - Senha: `123456`
   - ✓ Veja menu com: Dashboard, Meus Projetos, Submeter Versão, Minhas Avaliações
   - ✓ Badge mostrando "👨‍🎓 Aluno" na sidebar
   - ✓ Dashboard mostra dados do aluno

3. **Logout e login como Professor**
   - Email: `maria@example.com`
   - ✓ Veja menu com: Dashboard, Gerenciar Projetos, Avaliar Projetos, Desempenho, Risco
   - ✓ Badge mostrando "👨‍🏫 Professor"
   - ✓ Dashboard mostra projetos em risco

4. **Logout e login como Coordenador**
   - Email: `carlos@example.com`
   - ✓ Veja menu com: Dashboard, Monitoramento, Performance, Relatórios
   - ✓ Badge mostrando "👩‍💼 Coordenador"
   - ✓ Dashboard mostra estatísticas gerais

---

## 🔍 Teste 6: Títulos de Página Dinâmicos

### Objetivo
Validar que título muda baseado no role e página.

### Passos

1. **Como Aluno**:
   - Navegue para `/projetos` → Título: "Meus Projetos"
   - Navegue para `/avaliacoes` → Título: "Minhas Avaliações"

2. **Como Professor**:
   - Navegue para `/projetos` → Título: "Gerenciar Projetos"
   - Navegue para `/avaliacoes` → Título: "Avaliar Projetos"

3. **Como Coordenador**:
   - Navegue para `/relatorios` → Título: "Relatórios Gerais"
   - Navegue para `/turmas` → Título: "Monitoramento de Turmas"

---

## 🔍 Teste 7: Acesso Negado

### Objetivo
Validar que rota para professor é bloqueada para aluno.

### Passos

1. **Como Aluno**, tente acessar URLs de professor:
   - `http://localhost:5173/avaliacoes` (deve mostrar conteúdo de aluno)
   - Abra DevTools, Network tab
   - Veja que requisição para `/role-dashboard/stats` retorna dados de aluno

2. **Na API** (curl):
   ```bash
   # Como aluno, tente criar avaliação (endpoint futuro)
   # Esperado: 403 Forbidden
   ```

---

## ✅ Checklist de Testes

- [ ] Teste 1: Middleware bloqueia sem token
- [ ] Teste 2: Dashboard mostra dados corretos por role
- [ ] Teste 3: Filtro de dados funciona
- [ ] Teste 4: Middleware de role bloqueia acesso negado
- [ ] Teste 5: Frontend mostra menu correto
- [ ] Teste 6: Títulos são dinâmicos
- [ ] Teste 7: Acesso negado funciona

---

## 🐛 Troubleshooting

### Erro: "Token não fornecido"
- Verifique se está incluindo `Authorization: Bearer TOKEN` no header

### Erro: "Token inválido"
- Gere um novo token fazendo login
- Verifique se JWT_SECRET está configurado

### Dashboard vazio
- Certifique-se de ter projetos no banco
- Verifique se projeto tem `students` ou `created_by` = user_id

### Menu não muda
- Verifique role no banco de dados
- Limpe cache do navegador (F12 > Storage > Clear)
- Verifique console (DevTools) para erros

### Erro 403
- Verifique se usuário tem role correto
- Middleware valida `req.user.role`
- Alguns endpoints requerem roles específicas

---

## 📊 Comandos Úteis

```bash
# Ver todos os usuários
psql -U seu_usuario -d senacodex -c "SELECT id, name, email, role FROM users;"

# Ver todos os projetos
psql -U seu_usuario -d senacodex -c "SELECT id, name, advisor, students FROM projects LIMIT 5;"

# Limpar dados de teste
psql -U seu_usuario -d senacodex -c "DELETE FROM users WHERE email LIKE '%@example.com';"
```

---

**Status**: Todos os testes devem passar ✅
**Data**: 21 de Junho de 2026
**Próximo**: Implementar Sistema de Exclusão de Projetos
