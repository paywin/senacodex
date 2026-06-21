# 🎯 Implementação de Controle de Acesso por Role

## Resumo das Mudanças

Este documento descreve as mudanças implementadas para fornecer controle de acesso baseado em role (papel do usuário) no sistema SENACODEX.

### Objetivo

Separar o acesso e funcionalidades entre três tipos de usuários:
- **Aluno**: Vê apenas seus próprios projetos, notas e comentários
- **Professor**: Gerencia projetos de sua turma, avalia, comenta
- **Coordenador**: Monitora performance geral, relatórios, professores

---

## ✅ Mudanças Implementadas

### 1️⃣ Backend - Middleware de Autorização

**Arquivo**: `backend/src/middleware/index.ts`

Adicionado middleware `roleMiddleware()` que valida se o usuário tem as roles especificadas:

```typescript
export function roleMiddleware(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    next();
  };
}
```

### 2️⃣ Backend - Serviços por Role

**Arquivo**: `backend/src/services/roleBasedData.ts` (NOVO)

Serviços específicos para cada role que filtram dados no banco:

#### Aluno (Student)
- `getStudentProjects(studentId)`: Projetos do aluno
- `getStudentEvaluations(studentId)`: Avaliações recebidas
- `getStudentStats(studentId)`: Estatísticas personalizadas

#### Professor (Teacher)
- `getTeacherProjectsByClass(email, classCode)`: Projetos da turma
- `getTeacherStats(email)`: Estatísticas de turma
- `getTeacherRiskProjects(email)`: Projetos em risco

#### Coordenador (Coordinator)
- `getCoordinatorStats()`: Estatísticas gerais
- `getCoordinatorTeacherStats()`: Performance dos professores
- `getCoordinatorClassStatus(classCode)`: Status de turma específica

### 3️⃣ Backend - Controllers por Role

**Arquivo**: `backend/src/controllers/roleBasedDashboard.ts` (NOVO)

Controllers que usam os serviços e implementam a lógica:

- `getDashboardByRole()`: Retorna dashboard específico por role
- `getProjectsByRole()`: Projetos filtrados por role
- `getEvaluationsByRole()`: Avaliações filtradas
- `getClassStatusByCoordinator()`: Status de turma (coordenador)
- `getTeacherPerformanceByCoordinator()`: Performance (coordenador)

### 4️⃣ Backend - Novas Rotas

**Arquivo**: `backend/src/routes/roleBasedDashboard.ts` (NOVO)

```
GET  /api/role-dashboard/stats               # Dashboard por role
GET  /api/role-dashboard/projects            # Projetos por role
GET  /api/role-dashboard/evaluations         # Avaliações por role
GET  /api/role-dashboard/class/:classCode    # Status de turma
GET  /api/role-dashboard/teachers/performance # Performance de professores
```

### 5️⃣ Frontend - Navegação Dinâmica

**Arquivo**: `frontend/src/config/navigationByRole.ts` (NOVO)

Configuração de menu personalizado por role:

```typescript
export const allNavigationItems: NavigationItem[] = [
  // Comum
  { id: 'dashboard', label: 'Dashboard', roles: ['student', 'teacher', 'coordinator'] },
  
  // Aluno
  { id: 'meus-projetos', label: 'Meus Projetos', roles: ['student'] },
  { id: 'submeter-versao', label: 'Submeter Versão', roles: ['student'] },
  
  // Professor
  { id: 'gerenciar-projetos', label: 'Gerenciar Projetos', roles: ['teacher'] },
  
  // Coordenador
  { id: 'monitoramento-turmas', label: 'Monitoramento de Turmas', roles: ['coordinator'] },
];
```

### 6️⃣ Frontend - Sidebar Atualizada

**Arquivo**: `frontend/src/components/layout/Sidebar.tsx`

- Usa `getNavigationItemsByRole()` para filtrar menu
- Adiciona badge mostrando role do usuário
- Estilos diferentes para cada role

### 7️⃣ Frontend - Layout Atualizado

**Arquivo**: `frontend/src/components/layout/Layout.tsx`

- Usa `getPageTitle()` para título personalizado por role
- Integra nova navegação dinâmica

### 8️⃣ Frontend - Dashboard Remodelado

**Arquivo**: `frontend/src/pages/DashboardPage.tsx`

Dashboard agora mostra dados diferentes conforme o role:

#### Dashboard do Aluno 👨‍🎓
```
- Meus Projetos (total)
- Em Andamento
- Em Avaliação
- Avaliações Recebidas
- Nota Média
- Projetos Completos
```

#### Dashboard do Professor 👨‍🏫
```
- Total de Projetos
- Em Progresso
- Projetos em Risco
- Avaliações Pendentes
- Lista de projetos em risco
- Total avaliados
```

#### Dashboard do Coordenador 👩‍💼
```
- Total de Projetos
- Turmas
- Projetos Excelentes
- Projetos em Risco
- Distribuição por Status (Excelente/Bom/Médio/Baixo)
- Desempenho dos Professores
```

### 9️⃣ Frontend - Hook para Dashboard

**Arquivo**: `frontend/src/hooks/useRoleDashboard.ts` (NOVO)

Hook que faz fetch dos dados específicos por role:

```typescript
export function useRoleDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  // ... busca dados de /api/role-dashboard/stats
}
```

---

## 🧪 Como Testar

### 1. Preparar o Banco de Dados

Certifique-se de ter usuários com diferentes roles:

```sql
INSERT INTO users (name, email, password, role) VALUES
('João Silva', 'joao@example.com', '$hash...', 'student'),
('Maria Santos', 'maria@example.com', '$hash...', 'student'),
('Prof. Pedro', 'pedro@example.com', '$hash...', 'teacher'),
('Coordenador', 'coord@example.com', '$hash...', 'coordinator');
```

### 2. Testar Backend

```bash
# Login como Aluno
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"123456"}'

# Obter Dashboard do Aluno
curl -X GET http://localhost:3001/api/role-dashboard/stats \
  -H "Authorization: Bearer TOKEN_DO_ALUNO"

# Deve retornar apenas estatísticas do aluno
```

### 3. Testar Frontend

**Para Aluno**:
- Login como aluno
- Menu deve mostrar: Dashboard, Meus Projetos, Submeter Versão, Minhas Avaliações
- Dashboard mostra estatísticas de aluno

**Para Professor**:
- Login como professor
- Menu deve mostrar: Dashboard, Gerenciar Projetos, Avaliar Projetos, etc.
- Dashboard mostra turma e projetos em risco

**Para Coordenador**:
- Login como coordenador
- Menu deve mostrar: Dashboard, Monitoramento de Turmas, Performance de Professores
- Dashboard mostra estatísticas gerais e performance

---

## 📋 Próximos Passos Recomendados

### 1. Sistema de Solicitações de Exclusão

Criar tabela no banco:

```sql
CREATE TABLE project_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  student_id UUID NOT NULL REFERENCES users(id),
  teacher_id UUID NOT NULL REFERENCES users(id),
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Implementar:
- Aluno solicita exclusão (POST)
- Professor aprova/nega (PUT)
- Coordenador monitora (GET)

### 2. Melhorar Relacionamento de Dados

Adicionar no schema:

```sql
-- Relacionamento Aluno-Projeto
CREATE TABLE student_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  UNIQUE(student_id, project_id)
);

-- Comentários do Professor
CREATE TABLE project_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  teacher_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Criar Páginas Específicas

- `projetos-turma.tsx`: Gerenciamento de projetos (teacher)
- `turmas.tsx`: Monitoramento de turmas (coordinator)
- `professores.tsx`: Performance de professores (coordinator)
- `solicitacoes.tsx`: Gerenciar solicitações de exclusão

### 4. Componentes Reutilizáveis

- `TeacherProjectCard`: Com opções de avaliação
- `StudentProjectCard`: Com opções de edição
- `CoordinatorClassCard`: Com estatísticas
- `PermissionModal`: Para solicitar/aprovar exclusões

### 5. Validações Adicionais

- Aluno só pode editar/deletar seus próprios projetos
- Professor só pode avaliar projetos de sua turma
- Coordenador não pode modificar dados, apenas visualizar
- Auditoria de ações (quem avaliou, quando, etc)

---

## 🔐 Segurança

✅ **Implementado**:
- Middleware valida token em todas as rotas
- Controllers verificam role do usuário
- Dados filtrados no banco (não apenas em memória)
- Sem exposição de dados entre roles

⚠️ **Recomendações**:
- Implementar rate limiting
- Adicionar logs de auditoria
- Validar entrada de dados (sanitização)
- HTTPS em produção
- JWT com expiração curta

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se o token JWT é válido
2. Confirme o role do usuário no banco de dados
3. Verifique os logs do servidor
4. Teste com o curl antes de testes frontend

---

**Data**: 21 de Junho de 2026
**Status**: ✅ Concluído (MVP)
