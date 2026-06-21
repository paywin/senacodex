# 📐 Arquitetura SENACODEX

## Diagrama de Fluxo

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   Frontend      │◄────────┤     Backend      │◄────────┤   PostgreSQL     │
│   (React)       │         │    (Express)     │         │    Database      │
└─────────────────┘         └──────────────────┘         └──────────────────┘
       │                           │
       │ HTTP/REST               │ JWT Auth
       │ JSON                    │ Controllers
       │ Axios                   │ Services
       │                         │
       └─────────────────────────┘
```

## Componentes Principais

### Frontend (React + TypeScript)
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

### Backend (Node.js + Express)
```
src/index.ts (Inicialização)
├── config/
│   ├── database.ts (Conexão PostgreSQL)
│   └── index.ts (Variáveis de ambiente)
├── middleware/
│   ├── authMiddleware (JWT verification)
│   └── errorMiddleware (Tratamento de erros)
├── routes/
│   ├── auth.ts (Login, Register)
│   ├── dashboard.ts (Stats, Activities)
│   └── projects.ts (CRUD Projects)
├── controllers/
│   ├── auth.ts
│   └── index.ts (Dashboard & Projects)
├── services/
│   └── index.ts (Business logic & DB queries)
├── types/
│   └── index.ts (TypeScript interfaces)
└── utils/
    └── auth.ts (JWT, bcrypt)
```

### Database (PostgreSQL)
```
┌─────────────┐
│   USERS     │
├─────────────┤
│ id (UUID)   │◄─────────┐
│ name        │          │
│ email (Uq)  │          │
│ password    │          │
│ role        │          │
└─────────────┘          │
                         │
┌─────────────┐      ┌────────────────┐
│  PROJECTS   │      │   ACTIVITIES   │
├─────────────┤      ├────────────────┤
│ id (UUID)   │◄────►│ id (UUID)      │
│ name        │      │ user_id (FK)   │
│ status      │      │ text           │
│ progress    │      │ type           │
│ risk        │      └────────────────┘
└─────────────┘
       │
       │
       ▼
┌──────────────────┐    ┌────────────────┐
│ PROJECT_VERSIONS │    │  EVALUATIONS   │
├──────────────────┤    ├────────────────┤
│ id (UUID)        │    │ id (UUID)      │
│ project_id (FK)  │    │ project_id(FK) │
│ version          │    │ grade          │
│ submission_date  │    │ feedback       │
└──────────────────┘    └────────────────┘
```

## Fluxo de Autenticação

```
1. Usuário submete login
   └─► POST /api/auth/login {email, password}

2. Backend valida credenciais
   ├─► Query: SELECT * FROM users WHERE email = $1
   ├─► Comparar password com bcrypt
   └─► Se válido: Gerar JWT token

3. Backend retorna token + user data
   └─► Response: {accessToken, user}

4. Frontend armazena token em localStorage
   └─► localStorage.setItem('accessToken', token)

5. Requisições futuras incluem token
   └─► Header: Authorization: Bearer {token}

6. Backend valida token em cada requisição
   └─► Middleware: verifyToken(token)

7. Se inválido: redirecionar para login
   └─► Status 401 Unauthorized
```

## Fluxo de Requisição de Dados

```
1. Frontend: Componente React montado
   └─► useEffect(() => { api.getProjects() })

2. API Service prepara requisição
   ├─► URL: http://localhost:3000/api/projects
   ├─► Headers: {Authorization: "Bearer token"}
   └─► Method: GET

3. Backend recebe requisição
   ├─► Express routing para /api/projects
   ├─► Middleware: authMiddleware valida token
   └─► Controller: getProjectsHandler

4. Service executa query
   └─► SELECT * FROM projects ORDER BY created_at DESC

5. Backend retorna JSON
   └─► Response: [{id, name, status, ...}, ...]

6. Frontend atualiza estado
   ├─► setState(data)
   └─► Re-render componente

7. Usuário vê dados na UI
```

## Estados da Aplicação (Zustand)

### Auth Store
```typescript
{
  user: User | null;
  token: string | null;
  isAuthenticated: () => boolean;
}
```

### Project Store
```typescript
{
  projects: Project[];
  currentProject: Project | null;
  setProjects: (projects) => void;
  addProject: (project) => void;
}
```

## Segurança

- ✅ JWT para autenticação
- ✅ bcryptjs para hash de senhas
- ✅ CORS configurado
- ✅ Validação de entrada no backend
- ✅ Proteção de rotas no frontend
- ✅ Tokens armazenados seguramente
- ✅ Passwords nunca retornadas na API

## Performance

- ✅ Índices no banco de dados
- ✅ Lazy loading de componentes
- ✅ Otimização de renderização React
- ✅ Connection pooling PostgreSQL
- ✅ Caching de dados no frontend (localStorage)
- ✅ API calls apenas quando necessário

## Deploy

### Frontend (Vercel/Netlify)
```bash
npm run build
# Upload da pasta 'dist'
```

### Backend (Heroku/Railway/DigitalOcean)
```bash
npm run build
npm start
```

### Database (PostgreSQL Managed)
```
Usar PostgreSQL em cloud
(Heroku PostgreSQL, AWS RDS, DigitalOcean, etc)
```

