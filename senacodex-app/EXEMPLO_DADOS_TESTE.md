# Dados e Emails de Exemplo - SENACODEX

## Usuários de Teste

Aqui estão os usuários de exemplo que você pode usar para testar a aplicação:

### 1. **Aluno** 👨‍🎓
- **Email:** aluno@senac.com.br
- **Senha:** Aluno@123
- **Nome:** João Silva
- **Função:** Submeter projetos, visualizar avaliações
- **Acesso:** Dashboard, Meus Projetos, Submeter Versão, Avaliações, Relatórios

### 2. **Professor/Gestor** 👨‍🏫
- **Email:** professor@senac.com.br
- **Senha:** Professor@123
- **Nome:** Maria Santos
- **Função:** Avaliar projetos, visualizar relatórios
- **Acesso:** Todas as funcionalidades + gerenciamento de projetos

### 3. **Coordenador** 👨‍💼
- **Email:** coordenador@senac.com.br
- **Senha:** Coordenador@123
- **Nome:** Carlos Oliveira
- **Função:** Administrar a plataforma, gerar relatórios
- **Acesso:** Acesso completo a todas as funcionalidades

---

## Templates de Email

Veja [EMAIL_TEMPLATES.md](./EMAIL_TEMPLATES.md) para os templates de email que podem ser enviados pela plataforma:

1. **Email de Boas-vindas** - Enviado para alunos ao se registrarem
2. **Notificação de Submissão** - Enviado para professor quando aluno submete projeto
3. **Notificação de Avaliação** - Enviado para aluno quando seu projeto é avaliado

---

## Como Configurar os Dados de Teste

### Opção 1: Inserir Manualmente via SQL

1. Conecte ao banco de dados PostgreSQL:
```bash
psql -h localhost -U postgres -d senacodex
```

2. Primeiro, gere os hashes das senhas no Node.js:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log('Aluno@123:', bcrypt.hashSync('Aluno@123', 10)); console.log('Professor@123:', bcrypt.hashSync('Professor@123', 10)); console.log('Coordenador@123:', bcrypt.hashSync('Coordenador@123', 10));"
```

3. Copie os hashes gerados e substitua em `seed-sample-data.sql`

4. Execute o script:
```bash
psql -h localhost -U postgres -d senacodex -f seed-sample-data.sql
```

### Opção 2: Usar Interface de Registro

1. Acesse http://localhost:5174/register
2. Registre manualmente cada usuário com as credenciais acima

---

## Fluxo de Teste Recomendado

### 1. Login como **Aluno**
- Visualizar Dashboard
- Ir para "Meus Projetos"
- Submeter uma versão

### 2. Logout e Login como **Professor**
- Visualizar "Avaliações" (verá submissão do aluno)
- Avaliar o projeto
- Deixar feedback

### 3. Logout e Login como **Aluno**
- Visualizar a avaliação recebida em "Avaliações"
- Consultar "Relatórios" para ver resumo

---

## Estrutura dos Dados

```json
{
  "usuario": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "password_hash": "bcrypt",
    "role": "student|teacher|coordinator",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },
  "projeto": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "class": "string (e.g., 2024.1)",
    "advisor": "string (nome do professor)",
    "status": "Em Andamento|Em Revisão|Concluído|Ativado",
    "risk": "Alto|Médio|Baixo",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

---

## Notas Importantes

- As senhas nos exemplos acima são **apenas para teste**. 
- Em produção, use senhas fortes e gerencie credenciais via variáveis de ambiente.
- O backend deve estar rodando em `http://localhost:3000` para os testes funcionarem.
- Certifique-se de que o banco de dados PostgreSQL está ativo.

---

## Próximas Etapas

Para enviar emails reais, configure:
1. Variáveis de ambiente de SMTP
2. Implemente o serviço de envio de emails no backend
3. Integre os templates de email com o banco de dados
