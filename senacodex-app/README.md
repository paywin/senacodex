# 📚 Documentação SENACODEX

Sistema de Gerenciamento de Projetos Integradores — full-stack com React, Node.js, TypeScript e PostgreSQL.

---

## 📋 Índice

- [Stack Tecnológico](#stack-tecnológico)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Quick Start](#quick-start)
- [Arquitetura](#arquitetura)
- [API Endpoints](#api-endpoints)
- [Autenticação](#autenticação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Docker](#docker)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Troubleshooting](#troubleshooting)

---

## Stack Tecnológico

### Frontend
- **React 18** + TypeScript
- **Vite** (build tool)
- **React Router** (navegação)
- **Zustand** (state management)
- **Axios** (HTTP client)
- **CSS3** puro (design responsivo)

### Backend
- **Node.js** + Express
- **TypeScript**
- **PostgreSQL**
- **JWT** (autenticação)
- **bcryptjs** (criptografia)

---

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL 12+ instalado e rodando
- Git (opcional)

---

## Instalação & Inicialização Rápida (Um Comando)

O projeto está configurado para ser inicializado de forma extremamente simples com um script de setup automatizado.

```bash
# 1. Execute o comando de setup para copiar variáveis de ambiente e instalar dependências
npm run setup

# 2. Inicie a aplicação
npm run dev
```
*(Nota: A aplicação possui um fallback automático para banco em memória se o PostgreSQL estiver offline, permitindo o funcionamento imediato do login e das dashboards para teste!)*

---

## Quick Start

### Opção 1: Inicialização em Desenvolvimento (Modo Memória por Padrão se Postgres indisponível)

```bash
npm run setup
npm run dev
```

### Opção 2: Inicialização Completa com PostgreSQL (Via Docker Compose)

Se preferir usar o PostgreSQL real rodando em container Docker:

```bash
# 1. Inicie o banco de dados PostgreSQL
npm run dev:db

# 2. Execute a aplicação (que se conectará ao banco PostgreSQL local)
npm run dev
```

### Acessar a Aplicação

| Serviço       | URL                          |
|---------------|------------------------------|
| Frontend      | http://localhost:5173        |
| Backend API   | http://localhost:3000        |
| Banco de Dados| localhost:5432               |

### Credenciais de Demonstração (Contas de Teste)

| Perfil | Email | Senha | Descrição |
|--------|-------|-------|-----------|
| **Coordenador Demo** | `admin@example.com` | `Admin123` | Acesso completo a turmas, performance de professores e relatórios |
| **Aluno Demo** | `user@example.com` | `User123` | Acesso a painel de projetos, envio de novas versões e notas |
| **Aluno Senac** | `aluno@senac.com.br` | `Aluno@123` | Conta padrão de aluno |
| **Professor Senac** | `professor@senac.com.br` | `Professor@123` | Acesso a gerenciamento de projetos e lançamento de avaliações |
| **Coordenador Senac** | `coordenador@senac.com.br` | `Coordenador@123` | Conta padrão de coordenador |

> Você também pode registrar um novo usuário na tela de login se desejar.

### Scripts Disponíveis

| Comando                       | Descrição                          |
|-------------------------------|------------------------------------|
| `npm run setup`               | Copia `.env.example` -> `.env` e instala dependências |
| `npm run dev`                 | Roda frontend + backend concorrentemente |
| `npm run dev:db`              | Sobe o PostgreSQL no Docker em background |
| `npm run dev:full`            | Sobe o PostgreSQL Docker e roda frontend + backend |
| `npm run start:frontend`      | Apenas frontend                    |
| `npm run start:backend`       | Apenas backend                     |
| `npm run build`               | Build de produção para frontend + backend |

#### Backend
- `npm run dev` — servidor de desenvolvimento
- `npm run build` — compilar TypeScript
- `npm start` — servidor de produção

#### Frontend
- `npm run dev` — servidor de desenvolvimento (porta 5173)
- `npm run build` — build para produção
- `npm run preview` — preview do build

---

## Arquitetura

### Diagrama de Fluxo

```
┌─────────────────┐     HTTP/REST/JSON     ┌──────────────────┐     SQL      ┌──────────────────┐
│   Frontend      │◄──────────────────────►│     Backend      │◄────────────►│   PostgreSQL     │
│   (React)       │     JWT Auth           │    (Express)     │              │    Database      │
└─────────────────┘                        └──────────────────┘              └──────────────────┘
```

### Componentes Principais

#### Frontend
```
App.tsx (Raiz)
├── Layout (Sidebar + Header + Content)
├── Routes (Router)
│   ├── LoginPage (Pública)
│   ├── DashboardPage (Protegida)
│   ├── ProjectsPage (Protegida)
│   ├── SubmitVersionPage (Protegida)
│   ├── EvaluationsPage (Protegida)
│   ├── ReportsPage (Protegida)
│   └── RiskPanel (Protegida)
├── Components (Reutilizáveis)
│   ├── Sidebar
│   ├── Header
│   ├── StatCard
│   └── ActivityList
└── Services
    └── API (Axios instance com auth)
```

#### Backend
```
src/index.ts (Inicialização)
├── config/database.ts      (Conexão PostgreSQL)
├── config/index.ts         (Variáveis de ambiente)
├── middleware/              (JWT verification, error handling)
├── routes/                 (auth, dashboard, projects)
├── controllers/            (Lógica de requisição)
├── services/               (Lógica de negócio + DB queries)
├── types/index.ts          (TypeScript interfaces)
└── utils/auth.ts           (JWT, bcrypt)
```

### Estados da Aplicação (Zustand)

**Auth Store:**
```typescript
{
  user: User | null;
  token: string | null;
  isAuthenticated: () => boolean;
}
```

**Project Store:**
```typescript
{
  projects: Project[];
  currentProject: Project | null;
  setProjects: (projects) => void;
  addProject: (project) => void;
}
```

### Segurança
- ✅ JWT para autenticação
- ✅ bcryptjs para hash de senhas
- ✅ CORS configurado
- ✅ Validação de entrada no backend
- ✅ Proteção de rotas no frontend
- ✅ Passwords nunca retornadas na API

### Performance
- ✅ Índices no banco de dados
- ✅ Lazy loading de componentes
- ✅ Connection pooling PostgreSQL
- ✅ Caching no frontend (localStorage)

---

## API Endpoints

### Autenticação
| Método | Rota                    | Descrição              |
|--------|-------------------------|------------------------|
| POST   | `/api/auth/register`    | Registrar novo usuário |
| POST   | `/api/auth/login`       | Fazer login            |
| POST   | `/api/auth/logout`      | Fazer logout           |
| GET    | `/api/auth/profile`     | Obter perfil (auth)    |

### Dashboard
| Método | Rota                           | Descrição             |
|--------|--------------------------------|-----------------------|
| GET    | `/api/dashboard/stats`         | Estatísticas gerais   |
| GET    | `/api/dashboard/activities`    | Atividades recentes   |
| GET    | `/api/dashboard/risk-projects` | Projetos em risco     |

### Projetos
| Método | Rota                | Descrição                  |
|--------|---------------------|----------------------------|
| GET    | `/api/projects`     | Listar todos os projetos   |
| GET    | `/api/projects/:id` | Obter projeto específico   |
| POST   | `/api/projects`     | Criar novo projeto         |
| PUT    | `/api/projects/:id` | Atualizar projeto          |
| DELETE | `/api/projects/:id` | Deletar projeto            |

### Fluxo de Autenticação

1. Usuário submete login → `POST /api/auth/login {email, password}`
2. Backend valida credenciais (bcrypt) e gera JWT
3. Backend retorna `{accessToken, user}`
4. Frontend armazena token em `localStorage`
5. Requisições futuras incluem `Authorization: Bearer {token}`
6. Middleware valida token em cada requisição
7. Token inválido → status 401 → redireciona para login

---

## Variáveis de Ambiente

### Backend (`.env`)

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=senacodex
JWT_SECRET=dev_secret_key_very_secure
JWT_EXPIRE=24h
CORS_ORIGIN=http://localhost:5173
```

---

## Docker

```bash
# Iniciar containers
docker-compose up

# Parar e remover containers
docker-compose down

# Ver logs em tempo real
docker-compose logs -f
```

---

## Estrutura do Projeto

```
senacodex-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/     (Header, Sidebar, Layout)
│   │   │   └── ui/         (StatCard, ActivityList)
│   │   ├── pages/          (Dashboard, Projects, Login, etc.)
│   │   ├── services/       (API calls com Axios)
│   │   ├── store/          (Zustand — estado global)
│   │   ├── hooks/          (Custom hooks)
│   │   ├── types/          (Interfaces TypeScript)
│   │   ├── config/         (Navegação, etc.)
│   │   ├── App.tsx         (Componente raiz)
│   │   └── main.tsx        (Ponto de entrada)
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/         (auth, dashboard, projects)
│   │   ├── controllers/    (Lógica de requisição)
│   │   ├── services/       (Lógica de negócio)
│   │   ├── middleware/     (Auth, error handling)
│   │   ├── config/         (DB, env vars)
│   │   ├── types/          (Interfaces TypeScript)
│   │   ├── utils/          (JWT, bcrypt)
│   │   └── index.ts        (Ponto de entrada)
│   ├── .env.example
│   ├── schema.sql
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml
├── package.json            (Raiz — scripts concurrently)
└── README.md               (Este arquivo)
```

---

## Funcionalidades

- ✅ Dashboard com estatísticas em tempo real
- ✅ Gerenciamento de projetos
- ✅ Submissão de versões
- ✅ Sistema de avaliações
- ✅ Painel de risco
- ✅ Relatórios
- ✅ Autenticação segura (JWT)
- ✅ Interface responsiva

---

## Troubleshooting

### Frontend não carrega
1. Verifique se o servidor está em `http://localhost:5173`
2. Limpe cache do navegador (`Ctrl+Shift+Delete`)
3. Verifique console do navegador (F12)

### Backend não responde
1. Verifique se backend está em `http://localhost:3000`
2. Cheque variáveis de ambiente (`.env`)
3. Verifique conexão com PostgreSQL

### Erro de conexão com PostgreSQL
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE DATABASE senacodex;"
```

### "Cannot find module pg"
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Porta já em uso
```bash
# Linux/Mac
lsof -i :3000
lsof -i :5173

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Mate o processo e tente novamente
```

### Frontend não conecta ao backend
- Verifique `CORS_ORIGIN` em `backend/.env` (deve ser `http://localhost:5173`)
- Verifique proxy em `frontend/vite.config.ts` (deve apontar para `http://localhost:3000`)
- Limpe cache do navegador

---

## Build para Produção

```bash
# Frontend
cd frontend && npm run build   # gera pasta dist/

# Backend
cd backend && npm run build     # compila TypeScript
```

### Deploy
- **Frontend:** Vercel / Netlify (upload da pasta `dist`)
- **Backend:** Heroku / Railway / DigitalOcean
- **Database:** PostgreSQL gerenciado (Heroku Postgres, AWS RDS, etc.)

---

## Funcionalidades Futuras

- [ ] Testes unitários
- [ ] Paginação nas tabelas
- [ ] Upload de arquivos
- [ ] Sistema de notificações em tempo real
- [ ] Gráficos de análise
- [ ] Deploy em produção

---

> 💡 Use `npm run dev` para desenvolvimento com hot-reload. TypeScript fornece autocompletar automático. ESLint e Prettier já estão configurados. Todos os endpoints requerem autenticação JWT (exceto login/register).
