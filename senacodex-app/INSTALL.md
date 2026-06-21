# ✅ Checklist de Instalação - SENACODEX

## Pré-requisitos
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] PostgreSQL 12+ instalado e rodando
- [ ] Git instalado (opcional)

## Passo 1: Preparar o Projeto

```bash
# Navegue até a pasta do projeto
cd /home/paiva/Área\ de\ trabalho/senacodex-app

# Verifique que está no local correto
pwd
# Resultado esperado: /home/paiva/Área de trabalho/senacodex-app

# Verifique os arquivos principais
ls -la
# Você deve ver: frontend/, backend/, package.json, docker-compose.yml, etc.
```

## Passo 2: Configurar o Backend

```bash
# Entre na pasta do backend
cd backend

# Instale dependências
npm install
# ⏳ Isso levará alguns minutos...

# Verifique o arquivo .env
cat .env
# Deve mostrar as variáveis de ambiente

# Se as variáveis estiverem incorretas, edite:
# nano .env  (ou use seu editor preferido)
```

### Configuração do PostgreSQL

```bash
# Verifique se PostgreSQL está rodando
sudo systemctl status postgresql

# Se não estiver rodando
sudo systemctl start postgresql

# Acesse o PostgreSQL
sudo -u postgres psql

# Dentro do PostgreSQL, crie o banco de dados
CREATE DATABASE senacodex;

# Conecte ao banco
\c senacodex

# (Opcional) Execute o schema para criar tabelas
# Copie o conteúdo de schema.sql e execute aqui

# Saia
\q
```

### Testar Backend

```bash
# Ainda em backend/
npm run dev

# Você deve ver:
# ✓ Banco de dados conectado
# ✓ Servidor rodando em http://localhost:3000
# ✓ Ambiente: development

# Teste em outro terminal
curl http://localhost:3000/health
# Resultado esperado: {"status":"OK"}

# Pressione Ctrl+C para parar o servidor
```

## Passo 3: Configurar o Frontend

```bash
# Em outro terminal, entre em frontend/
cd frontend

# Instale dependências
npm install
# ⏳ Isso levará alguns minutos...

# Verifique o arquivo vite.config.ts
cat vite.config.ts
# Deve mostrar proxy para http://localhost:3000
```

### Testar Frontend

```bash
# Ainda em frontend/
npm run dev

# Você deve ver:
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help

# Abra no navegador: http://localhost:5173
# Você será redirecionado para /login

# Pressione Ctrl+C para parar o servidor
```

## Passo 4: Executar Tudo Junto

### Opção A: Dois Terminais

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

### Opção B: Um Terminal (da raiz)

```bash
# Certifique-se de estar em senacodex-app/
cd /home/paiva/Área\ de\ trabalho/senacodex-app

# Instale concurrently (se não tiver)
npm install

# Rode ambos
npm run dev
```

### Opção C: Docker

```bash
# Certifique-se de estar em senacodex-app/
docker-compose up

# Para parar: Ctrl+C
# Para limpar: docker-compose down
```

## Passo 5: Testar a Aplicação

### Registrar novo usuário
1. Abra http://localhost:5173
2. Clique em "Criar uma nova conta"
3. Preencha: Nome, Email, Senha
4. Clique em registrar
5. Você será redirecionado para o dashboard

### Fazer Login
1. Email: seu.email@example.com
2. Senha: sua_senha
3. Clique em entrar

### Navegar pelas páginas
- Dashboard (já vem por padrão)
- Meus Projetos
- Submeter Versão
- Avaliações
- Relatórios
- Painel de Risco

## Passo 6: Verificar Erros Comuns

### Erro: "Cannot find module pg"
```bash
# Solução: Reinstale dependências
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Erro: "connection refused" ao PostgreSQL
```bash
# Solução: Verifique se PostgreSQL está rodando
sudo systemctl status postgresql
sudo systemctl start postgresql

# Ou crie o banco se não existir
sudo -u postgres psql
CREATE DATABASE senacodex;
\q
```

### Erro: "Port 3000 already in use"
```bash
# Encontre o processo usando a porta
lsof -i :3000

# Mate o processo
kill -9 <PID>

# Ou altere a porta em backend/.env
# PORT=3001
```

### Erro: "Port 5173 already in use"
```bash
# Encontre o processo usando a porta
lsof -i :5173

# Mate o processo
kill -9 <PID>

# Ou inicie em outra porta
npm run dev -- --port 5174
```

### Frontend não conecta ao backend
```bash
# Verifique CORS em backend/.env
CORS_ORIGIN=http://localhost:5173

# Verifique proxy em frontend/vite.config.ts
# Deve apontar para http://localhost:3000

# Limpe cache do navegador: Ctrl+Shift+Delete
```

## Passo 7: Estrutura Final Esperada

```
senacodex-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
├── QUICK_START.md
├── ARCHITECTURE.md
├── package.json
└── docker-compose.yml
```

## Passo 8: Próximos Passos

- [ ] Registre alguns usuários de teste
- [ ] Crie alguns projetos
- [ ] Teste as funcionalidades principais
- [ ] Explore o código e familiarize-se
- [ ] Considere adicionar novas features
- [ ] Configure para produção quando pronto

## 🎉 Parabéns!

Seu ambiente SENACODEX está pronto para desenvolvimento!

### Recursos Úteis
- Frontend README: `frontend/README.md`
- Backend README: `backend/README.md`
- Arquitetura: `ARCHITECTURE.md`
- Quick Start: `QUICK_START.md`

### Comandos Úteis

```bash
# Development
npm run dev                    # Roda frontend + backend
npm run start:frontend        # Apenas frontend
npm run start:backend         # Apenas backend

# Build
npm run build                 # Build frontend + backend

# Database
npm run schema:migrate        # Cria tabelas (quando implementado)

# Docker
docker-compose up             # Roda tudo em containers
docker-compose down           # Para e remove containers
docker-compose logs -f        # Ver logs em tempo real
```

## ❓ Precisa de Ajuda?

1. Verifique os READMEs em cada pasta
2. Consulte ARCHITECTURE.md para entender a estrutura
3. Verifique os logs do terminal para mais detalhes
4. Abra uma issue no repositório

Sucesso! 🚀
