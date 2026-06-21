# 🗑️ Sistema de Solicitações de Exclusão de Projetos

## 📋 Requisitos

### Para Aluno
- Só pode solicitar exclusão DEPOIS que professor avaliou
- Vê histórico de solicitações
- Pode ver status (pendente, aprovado, rejeitado)
- Mensagem de motivo se rejeitado

### Para Professor  
- Vê solicitações dos alunos de sua turma
- Aprova ou rejeita com motivo opcional
- Vê histórico de decisões

### Para Coordenador
- Vê TODAS as solicitações
- Apenas visualiza (sem modificar)
- Relatório de aprovações/rejeições

---

## 🛠️ Implementação

### Passo 1: Banco de Dados

```sql
-- Tabela de Solicitações de Exclusão
CREATE TABLE project_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id),
    teacher_id UUID NOT NULL REFERENCES users(id),
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    teacher_response TEXT,
    teacher_decision_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_deletion_requests_student ON project_deletion_requests(student_id);
CREATE INDEX idx_deletion_requests_teacher ON project_deletion_requests(teacher_id);
CREATE INDEX idx_deletion_requests_project ON project_deletion_requests(project_id);
CREATE INDEX idx_deletion_requests_status ON project_deletion_requests(status);
```

### Passo 2: Backend - Serviço

**Arquivo**: `backend/src/services/deletionRequests.ts` (NOVO)

```typescript
import { query } from '@/config/database';

export async function createDeletionRequest(
  projectId: string,
  studentId: string,
  teacherId: string,
  reason: string
): Promise<any> {
  const result = await query(
    `INSERT INTO project_deletion_requests 
     (project_id, student_id, teacher_id, reason)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [projectId, studentId, teacherId, reason],
  );
  return result.rows[0];
}

export async function getStudentDeletionRequests(studentId: string): Promise<any[]> {
  const result = await query(
    `SELECT * FROM project_deletion_requests 
     WHERE student_id = $1 
     ORDER BY created_at DESC`,
    [studentId],
  );
  return result.rows;
}

export async function getTeacherDeletionRequests(teacherId: string): Promise<any[]> {
  const result = await query(
    `SELECT * FROM project_deletion_requests 
     WHERE teacher_id = $1 
     ORDER BY status, created_at DESC`,
    [teacherId],
  );
  return result.rows;
}

export async function approveDeletionRequest(
  requestId: string,
  teacherId: string
): Promise<any> {
  const result = await query(
    `UPDATE project_deletion_requests 
     SET status = 'approved', teacher_decision_at = NOW()
     WHERE id = $1 AND teacher_id = $2
     RETURNING *`,
    [requestId, teacherId],
  );
  return result.rows[0];
}

export async function rejectDeletionRequest(
  requestId: string,
  teacherId: string,
  reason: string
): Promise<any> {
  const result = await query(
    `UPDATE project_deletion_requests 
     SET status = 'rejected', teacher_response = $1, teacher_decision_at = NOW()
     WHERE id = $2 AND teacher_id = $3
     RETURNING *`,
    [reason, requestId, teacherId],
  );
  return result.rows[0];
}
```

### Passo 3: Backend - Controller

**Arquivo**: `backend/src/controllers/deletionRequests.ts` (NOVO)

```typescript
import { Request, Response } from 'express';
import {
  createDeletionRequest,
  getStudentDeletionRequests,
  getTeacherDeletionRequests,
  approveDeletionRequest,
  rejectDeletionRequest,
} from '@/services/deletionRequests';

export async function createRequest(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== 'student') {
      res.status(403).json({ message: 'Apenas alunos podem fazer solicitações' });
      return;
    }

    const { projectId, reason } = req.body;

    if (!projectId || !reason) {
      res.status(400).json({ message: 'Projeto e motivo são obrigatórios' });
      return;
    }

    // TODO: Verificar se projeto já foi avaliado
    // TODO: Obter teacher_id do projeto

    const request = await createDeletionRequest(
      projectId,
      req.user.id,
      'teacher_id_aqui', // Implementar lógica para obter
      reason
    );

    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar solicitação' });
  }
}

export async function getMyRequests(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== 'student') {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    const requests = await getStudentDeletionRequests(req.user.id);
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar solicitações' });
  }
}

export async function getPendingRequests(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== 'teacher') {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    const requests = await getTeacherDeletionRequests(req.user.id);
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar solicitações' });
  }
}

export async function approveRequest(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== 'teacher') {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    const { requestId } = req.params;
    const updated = await approveDeletionRequest(requestId, req.user.id);

    if (!updated) {
      res.status(404).json({ message: 'Solicitação não encontrada' });
      return;
    }

    // TODO: Deletar projeto aqui

    res.json({ message: 'Solicitação aprovada', request: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao aprovar solicitação' });
  }
}

export async function rejectRequest(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== 'teacher') {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    const { requestId } = req.params;
    const { reason } = req.body;

    const updated = await rejectDeletionRequest(requestId, req.user.id, reason);

    if (!updated) {
      res.status(404).json({ message: 'Solicitação não encontrada' });
      return;
    }

    res.json({ message: 'Solicitação rejeitada', request: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao rejeitar solicitação' });
  }
}
```

### Passo 4: Backend - Rotas

**Arquivo**: `backend/src/routes/deletionRequests.ts` (NOVO)

```typescript
import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '@/middleware';
import * as deletionController from '@/controllers/deletionRequests';

const router = Router();

router.use(authMiddleware);

// Aluno
router.post('/', roleMiddleware('student'), deletionController.createRequest);
router.get('/my-requests', roleMiddleware('student'), deletionController.getMyRequests);

// Professor
router.get('/pending', roleMiddleware('teacher'), deletionController.getPendingRequests);
router.put('/:requestId/approve', roleMiddleware('teacher'), deletionController.approveRequest);
router.put('/:requestId/reject', roleMiddleware('teacher'), deletionController.rejectRequest);

export default router;
```

### Passo 5: Frontend - Hook

**Arquivo**: `frontend/src/hooks/useDeletionRequests.ts` (NOVO)

```typescript
import { useState } from 'react';
import api from '@/services/api';

export function useDeletionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyRequests = async (token: string) => {
    setLoading(true);
    try {
      const res = await api.get('/deletion-requests/my-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async (token: string) => {
    setLoading(true);
    try {
      const res = await api.get('/deletion-requests/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (projectId: string, reason: string, token: string) => {
    try {
      const res = await api.post(
        '/deletion-requests',
        { projectId, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const approveRequest = async (requestId: string, token: string) => {
    try {
      const res = await api.put(
        `/deletion-requests/${requestId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const rejectRequest = async (requestId: string, reason: string, token: string) => {
    try {
      const res = await api.put(
        `/deletion-requests/${requestId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    requests,
    loading,
    error,
    fetchMyRequests,
    fetchPendingRequests,
    createRequest,
    approveRequest,
    rejectRequest,
  };
}
```

### Passo 6: Frontend - Componentes

**Componente**: `frontend/src/components/DeletionRequestModal.tsx`

- Modal para aluno solicitar exclusão
- Campo para motivo
- Botões confirmar/cancelar

**Componente**: `frontend/src/components/DeletionRequestsList.tsx`

- Lista de solicitações
- Status visual (pendente/aprovado/rejeitado)
- Para professor: botões aprovar/rejeitar

---

## 📌 Checklist de Implementação

- [ ] Criar tabela no banco
- [ ] Criar serviço `deletionRequests.ts`
- [ ] Criar controller `deletionRequests.ts`
- [ ] Criar rotas `deletionRequests.ts`
- [ ] Adicionar rotas ao `index.ts`
- [ ] Criar hook `useDeletionRequests.ts`
- [ ] Criar componente `DeletionRequestModal.tsx`
- [ ] Criar componente `DeletionRequestsList.tsx`
- [ ] Integrar modal em `ProjectCard` (aluno)
- [ ] Integrar lista em página de solicitações (professor)
- [ ] Testes de integração
- [ ] Testes de autorização

---

## 🧪 Testes Sugeridos

```bash
# Aluno cria solicitação
curl -X POST http://localhost:3001/api/deletion-requests \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"projectId":"123","reason":"Projeto não passou"}'

# Professor vê solicitações
curl -X GET http://localhost:3001/api/deletion-requests/pending \
  -H "Authorization: Bearer TOKEN_PROFESSOR"

# Professor aprova
curl -X PUT http://localhost:3001/api/deletion-requests/123/approve \
  -H "Authorization: Bearer TOKEN_PROFESSOR"

# Professor rejeita
curl -X PUT http://localhost:3001/api/deletion-requests/123/reject \
  -H "Authorization: Bearer TOKEN_PROFESSOR" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Projeto ainda é válido"}'
```

---

**Prioridade**: 🔴 Alta
**Estimativa**: 4-6 horas
**Dependências**: Implementação atual de role-based access
