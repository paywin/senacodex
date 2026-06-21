# 🚀 Guia Rápido - SENACODEX

## Iniciar Projeto em Desenvolvimento

### Opção 1: Desde a raiz (Recomendado)

```bash
cd senacodex-app

# Instalar todas as dependências
npm install

# Iniciar frontend e backend simultaneamente
npm run dev
```

### Opção 2: Separadamente

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Opção 3: Com Docker

```bash
docker-compose up
```

## 🌐 Acessar a Aplicação

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Banco de Dados:** localhost:5432

## 📝 Credenciais Padrão (Para Teste)

Você pode registrar um novo usuário na tela de login, ou use essas credenciais se tiverem sido pré-carregadas:

- Email: `admin@example.com`
- Senha: `admin123`

## 📊 Estrutura de Dados

### Usuários (Users)
- ID (UUID)
- Nome
- Email (Único)
- Senha (Hash bcrypt)
- Role: student | teacher | coordinator
- Avatar (opcional)

### Projetos (Projects)
- ID (UUID)
- Nome
- Descrição
- Turma (Class)
- Orientador (Advisor)
- Status: Em Andamento | Em Revisão | Concluído | Ativado
- Progresso (0-100%)
- Risco: Alto | Médio | Baixo
- Alunos (array)
- Membros da Equipe (array)

## 🔌 Principais Endpoints da API

### Autenticação
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/profile
```

### Dashboard
```
GET /api/dashboard/stats
GET /api/dashboard/activities
GET /api/dashboard/risk-projects
```

### Projetos
```
GET /api/projects
GET /api/projects/:id
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id
```

## 🛠️ Stack Tecnológico

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- React Router (Navegação)
- Zustand (State Management)
- Axios (HTTP Client)
- CSS3 Puro (Responsivo)

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT (Autenticação)
- bcryptjs (Segurança)

## 📂 Estrutura de Pastas

```
frontend/
  ├── src/
  │   ├── components/      # UI Components
  │   ├── pages/          # Page Components
  │   ├── services/       # API Calls
  │   ├── store/          # Zustand Store
  │   ├── hooks/          # Custom Hooks
  │   ├── types/          # TS Interfaces
  │   └── utils/          # Utilities

backend/
  ├── src/
  │   ├── controllers/    # Lógica de Requisição
  │   ├── services/       # Lógica de Negócio
  │   ├── routes/         # Endpoints
  │   ├── middleware/     # Express Middleware
  │   ├── models/         # Schemas
  │   ├── types/          # TS Interfaces
  │   └── config/         # Configuração
```

## 🐛 Troubleshooting

### Frontend não carrega
1. Verifique se o servidor está rodando em http://localhost:5173
2. Limpe cache: `Ctrl+Shift+Delete` (Chrome)
3. Verifique console do navegador (F12)

### Backend não responde
1. Verifique se backend está em http://localhost:3000
2. Checque variáveis de ambiente (.env)
3. Verifique conexão com PostgreSQL

### Erro de conexão com DB
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Criar banco se necessário
createdb senacodex
```

## 📝 Próximas Etapas

1. ✅ Criar mais componentes de UI
2. ✅ Implementar páginas completas
3. ✅ Adicionar testes unitários
4. ✅ Implementar paginação nas tabelas
5. ✅ Adicionar upload de arquivos
6. ✅ Criar sistema de notificações em tempo real
7. ✅ Implementar gráficos de análise
8. ✅ Deploy em produção

## 💡 Tips

- Use `npm run dev` para desenvolvimento com hot-reload
- TypeScript fornece autocompletar automático
- ESLint e Prettier já estão configurados
- Todos os endpoints requerem autenticação JWT (exceto login/register)

## 🤝 Precisando de Ajuda?

Consulte os READMEs específicos:
- Frontend: `frontend/README.md`
- Backend: `backend/README.md`

