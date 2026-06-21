# SENACODEX - Sistema de Gerenciamento de Projetos Integradores

Uma aplicação full-stack moderna para gerenciamento de Projetos Integradores com React, Node.js, TypeScript e PostgreSQL.

## 🚀 Tecnologias

### Frontend
- **React 18** com TypeScript
- **Vite** para desenvolvimento rápido
- **React Router** para navegação
- **Zustand** para gerenciamento de estado
- **Axios** para requisições HTTP
- **CSS3** com design responsivo

### Backend
- **Node.js** com TypeScript
- **Express** para API REST
- **PostgreSQL** como banco de dados
- **JWT** para autenticação
- **bcryptjs** para criptografia de senhas

## 📋 Pré-requisitos

- Node.js v18+
- PostgreSQL v12+
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório

```bash
cd senacodex-app
```

### 2. Setup do Backend

```bash
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Edite o arquivo .env se necessário
nano .env

# Compile TypeScript
npm run build

# Inicie o servidor de desenvolvimento
npm run dev
```

O backend estará disponível em `http://localhost:3000`

### 3. Setup do Frontend

```bash
cd ../frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 🐳 Com Docker (Opcional)

```bash
# Inicie os containers
docker-compose up -d

# Acesse o frontend em http://localhost:5173
# O backend estará em http://localhost:3000
```

## 📚 Estrutura do Projeto

```
senacodex-app/
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes React reutilizáveis
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── services/         # Serviços de API
│   │   ├── store/            # Zustand store (estado global)
│   │   ├── hooks/            # Custom hooks
│   │   ├── types/            # Tipos TypeScript
│   │   ├── utils/            # Funções utilitárias
│   │   ├── App.tsx           # Componente raiz
│   │   └── main.tsx          # Ponto de entrada
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/      # Controladores
│   │   ├── services/         # Lógica de negócios
│   │   ├── routes/           # Rotas da API
│   │   ├── middleware/       # Middlewares Express
│   │   ├── models/           # Modelos de dados
│   │   ├── types/            # Tipos TypeScript
│   │   ├── utils/            # Funções utilitárias
│   │   ├── config/           # Configurações
│   │   └── index.ts          # Ponto de entrada
│   └── package.json
│
└── docker-compose.yml
```

## 🔐 Autenticação

A aplicação usa JWT (JSON Web Tokens) para autenticação. Tokens são armazenados no localStorage e inclusos automaticamente em todas as requisições.

### Endpoints de Autenticação

- **POST** `/api/auth/register` - Registrar novo usuário
- **POST** `/api/auth/login` - Fazer login
- **POST** `/api/auth/logout` - Fazer logout
- **GET** `/api/auth/profile` - Obter perfil (requer autenticação)

## 📡 API Endpoints

### Dashboard
- **GET** `/api/dashboard/stats` - Estatísticas gerais
- **GET** `/api/dashboard/activities` - Atividades recentes
- **GET** `/api/dashboard/risk-projects` - Projetos em risco

### Projetos
- **GET** `/api/projects` - Listar todos os projetos
- **GET** `/api/projects/:id` - Obter projeto específico
- **POST** `/api/projects` - Criar novo projeto

## 🎨 Funcionalidades

- ✅ Dashboard com estatísticas em tempo real
- ✅ Gerenciamento de projetos
- ✅ Submissão de versões
- ✅ Sistema de avaliações
- ✅ Painel de risco
- ✅ Relatórios
- ✅ Autenticação segura
- ✅ Interface responsiva
- ✅ Notificações

## 🔄 Fluxo de Desenvolvimento

1. **Frontend** faz requisição HTTP para **Backend**
2. **Backend** valida dados e consulta **PostgreSQL**
3. **Resposta** é enviada em JSON com status apropriado
4. **Frontend** atualiza UI com dados recebidos

## 📝 Variáveis de Ambiente

### Backend (.env)
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

## 🚨 Troubleshooting

### Erro de conexão com banco de dados
- Certifique-se que PostgreSQL está rodando
- Verifique credenciais em `.env`
- Crie o banco de dados: `createdb senacodex`

### Frontend não conecta ao backend
- Verifique CORS_ORIGIN em `.env` do backend
- Certifique-se que backend está rodando em `http://localhost:3000`
- Limpe cache do navegador

### Porta já em uso
```bash
# Linux/Mac
lsof -i :3000    # Backend
lsof -i :5173    # Frontend

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5173
```

## 📦 Build para Produção

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm run build
```

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## ✉️ Contato

Para dúvidas ou sugestões, abra uma issue no repositório.
