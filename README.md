# ProjetoDS — Prontuário Eletrônico · Clínica Escola UFPE

Sistema de prontuário eletrônico desenvolvido para a disciplina DS2 (UFPE).

---

## Rodando localmente (desenvolvimento)

```bash
# Backend
cd backend
npm install
npx prisma migrate dev
npm run dev        # http://localhost:3000

# Frontend (outro terminal)
cd frontend
npm install
npm run dev        # http://localhost:5173
```

## Rodando com Docker

```bash
cp backend/.env.example backend/.env   # preencha as variáveis antes
docker compose up --build
```

Acesse `http://localhost:8080` após os containers subirem.

---

## Variáveis de ambiente (backend/.env)

| Variável | Exemplo | Descrição |
|---|---|---|
| `DATABASE_URL` | `file:./prisma/dev.db` | Caminho do banco SQLite |
| `JWT_SECRET` | *(veja aviso abaixo)* | Segredo para assinar tokens JWT |
| `CORS_ORIGIN` | `http://localhost:8080` | Origens permitidas (separadas por vírgula) |
| `PORT` | `3000` | Porta do servidor Express |

---

## ⚠️ Segurança — JWT_SECRET

> **NUNCA suba o `.env` real para o repositório.**

O arquivo `backend/.env.example` usa o valor `segredo123` apenas como exemplo didático.
Em qualquer ambiente além do seu computador local, use uma string aleatória longa:

```bash
# Gera um segredo seguro (Linux/macOS/WSL)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Quem lê o repositório e conhece o `JWT_SECRET` consegue **forjar tokens de qualquer usuário**, incluindo ADMIN. Troque antes de subir para qualquer servidor.

---

## Estrutura do projeto

```
ProjetoDS/
├── backend/          # Node + Express + Prisma + SQLite
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── types/
│   └── prisma/schema.prisma
├── frontend/         # React + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── stores/
│   └── nginx.conf    # Proxy para o backend em produção (Docker)
└── docker-compose.yml
```
