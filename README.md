# Clínica Escola de Odontologia — UFPE 
> Sistema de gestão de prontuários, agendamentos e fila de espera da Clínica Escola de Odontologia do CIn/UFPE.
> Projeto acadêmico desenvolvido na disciplina CIN0136 — Desenvolvimento de Software · 2026.1

---

## Sumário

1. [Sobre o Projeto](#sobre-o-projeto)
2. [Funcionalidades](#funcionalidades)
3. [Tecnologias e Frameworks](#tecnologias-e-frameworks)
4. [Dependências](#dependências)
5. [Pré-requisitos](#pré-requisitos)
6. [Como rodar localmente](#como-rodar-localmente)
7. [Como rodar com Docker](#como-rodar-com-docker)
8. [Variáveis de Ambiente](#variáveis-de-ambiente)
9. [Banco de Dados](#banco-de-dados)
10. [Como testar](#como-testar)
11. [Estrutura de Pastas](#estrutura-de-pastas)
12. [Rotas da API](#rotas-da-api)
13. [Perfis de Acesso](#perfis-de-acesso)
14. [Decisões Arquiteturais (ADRs)](#decisões-arquiteturais-adrs)
15. [Equipe](#equipe)

---

## Sobre o Projeto

A Clínica Escola de Odontologia da UFPE atende pacientes por meio de atendimentos supervisionados realizados por estudantes sob orientação de professores. O sistema digitaliza e centraliza esse processo, substituindo fluxos manuais por uma plataforma web com controle de acesso por perfil.

**Problema resolvido:** gestão descentralizada de prontuários, fila de espera sem priorização e agendamentos feitos manualmente.

**Solução:** plataforma web com 4 perfis de acesso (Estudante, Professor, NAPA e Coordenador/Admin), cada um com permissões e dashboards específicos para suas responsabilidades.

---

## Funcionalidades

- Autenticação com JWT e controle de acesso por perfil (RBAC)
- Cadastro de usuários com dados específicos por perfil
- Edição de perfil próprio (dados pessoais, dados de estágio/registro profissional, senha)
- Criação, edição, assinatura e histórico de prontuários eletrônicos
- Fila de espera com priorização (URGENTE > NORMAL > ELETIVO)
- Gerenciamento de agenda e ofertas de atendimento
- Painel administrativo com gestão completa de usuários (CRUD)
- Dashboards distintos por perfil (Estudante, Professor, NAPA, Admin)
- Deploy containerizado com Docker, servido em produção via Nginx

---

## Tecnologias e Frameworks

### Backend
| Tecnologia | Versão | Para que serve |
|---|---|---|
| Node.js | 18+ | Ambiente de execução JavaScript no servidor |
| TypeScript | ^6.0.3 | Tipagem estática para maior segurança no código |
| Express | ^5.2.1 | Framework web para criação das rotas da API REST |
| Prisma ORM | ^5.22.0 | Mapeamento objeto-relacional e acesso ao banco de dados |
| SQLite | — | Banco de dados relacional em arquivo, persistido via volume Docker |
| JSON Web Token | ^9.0.3 | Geração e validação de tokens de autenticação |
| bcrypt / bcryptjs | ^6.0.0 / ^3.0.3 | Hash seguro de senhas antes de salvar no banco |
| dotenv | ^17.4.2 | Carregamento de variáveis de ambiente do arquivo `.env` |
| cors | ^2.8.6 | Controle de origens autorizadas a acessar a API |
| Vitest | ^4.1.5 | Framework de testes unitários e cobertura |
| supertest | ^7.2.2 | Testes de integração das rotas HTTP |
| ts-node | ^10.9.2 | Execução de TypeScript diretamente sem compilar |

### Frontend
| Tecnologia | Versão | Para que serve |
|---|---|---|
| React | ^18.3.1 | Biblioteca para construção de interfaces de usuário |
| TypeScript | ^5.5.3 | Tipagem estática no frontend |
| Vite | ^5.4.21 | Bundler e servidor de desenvolvimento |
| React Router DOM | ^6.26.2 | Roteamento de páginas e controle de rotas privadas por perfil |
| Axios | ^1.7.7 | Cliente HTTP para chamadas à API, com interceptors de token e 401 |
| Zustand | ^5.0.0 | Gerenciamento de estado global (autenticação) |
| TailwindCSS | ^3.4.11 | Framework CSS utilitário para estilização |
| TanStack React Query | ^5.56.2 | Gerenciamento de estado de servidor e cache de dados |
| clsx + tailwind-merge | — | Composição condicional de classes CSS |

### Infraestrutura
| Tecnologia | Para que serve |
|---|---|
| Docker | Containerização do backend e frontend |
| Docker Compose | Orquestração dos containers (backend + frontend + volume do banco) |
| Nginx | Servidor do frontend em produção e proxy reverso para o backend |

---

## Dependências

### Backend — produção
```json
"@prisma/client": "^5.22.0"
"bcrypt": "^6.0.0"
"bcryptjs": "^3.0.3"
"cors": "^2.8.6"
"dotenv": "^17.4.2"
"express": "^5.2.1"
"jsonwebtoken": "^9.0.3"
"prisma": "^5.22.0"
```

### Backend — desenvolvimento
```json
"@types/bcrypt": "^6.0.0"
"@types/bcryptjs": "^2.4.6"
"@types/cors": "^2.8.19"
"@types/express": "^5.0.6"
"@types/jsonwebtoken": "^9.0.10"
"@types/node": "^25.6.0"
"@types/supertest": "^7.2.0"
"@vitest/coverage-v8": "^4.1.5"
"supertest": "^7.2.2"
"ts-node": "^10.9.2"
"typescript": "^6.0.3"
"vitest": "^4.1.5"
```

### Frontend — produção
```json
"@tanstack/react-query": "^5.56.2"
"axios": "^1.7.7"
"clsx": "^2.1.1"
"react": "^18.3.1"
"react-dom": "^18.3.1"
"react-router-dom": "^6.26.2"
"tailwind-merge": "^2.5.2"
"zustand": "^5.0.0"
```

### Frontend — desenvolvimento
```json
"@types/react": "^18.3.3"
"@types/react-dom": "^18.3.0"
"@vitejs/plugin-react": "^4.3.1"
"autoprefixer": "^10.4.20"
"eslint": "^9.9.0"
"postcss": "^8.4.47"
"tailwindcss": "^3.4.11"
"typescript": "^5.5.3"
"vite": "^5.4.21"
```

> Como instalar: dentro de `backend/` e `frontend/`, rode `npm install`. O npm lê o `package.json` e instala automaticamente todas as dependências listadas acima nas versões compatíveis.

---

## Pré-requisitos

Para rodar localmente:
- [Node.js 18+](https://nodejs.org) — verifique com `node -v`
- [Git](https://git-scm.com)
- Extensão **Thunder Client** (VS Code) — para testar as rotas da API
- Extensão **Prisma** (VS Code) — para visualizar o banco

Para rodar com Docker:
- [Docker](https://www.docker.com/) e Docker Compose instalados

---

## Como rodar localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/ProjetoDS.git
cd ProjetoDS
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env        # crie e preencha o .env (veja seção abaixo)
npx prisma migrate dev
npx prisma generate
npm run seed                # cria o primeiro usuário ADMIN
npm run dev
```
Backend disponível em `http://localhost:3000`.

Credenciais do admin criado pelo seed:
```
email: admin@ufpe.br
senha: admin123
```

### 3. Frontend
Em um novo terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend disponível em `http://localhost:5173`.

### Resumo dos terminais
| Terminal | Comando | Fica rodando? |
|---|---|---|
| 1 | `cd backend && npm run dev` | ✅ sim |
| 2 | `cd backend && npm run seed` | ❌ só na 1ª vez |
| 3 | `cd frontend && npm run dev` | ✅ sim |

---

## Como rodar com Docker

O projeto está containerizado com `docker-compose.yml` na raiz, orquestrando dois serviços: `backend` e `frontend`.

```bash
docker-compose up --build
```

- **Backend** fica disponível em `http://localhost:3333` (mapeado da porta interna 3000)
- **Frontend** fica disponível em `http://localhost:8080/ho` (servido pelo Nginx)

O banco SQLite é persistido no volume `sqlite_data`, então os dados não se perdem ao reiniciar os containers.

### Como funciona por dentro
- O **backend** roda em um container Node 18 Alpine. No start, executa `prisma migrate deploy` (aplica migrations) e depois `npm start`.
- O **frontend** é compilado com Vite e o resultado é servido por um Nginx, dentro do subdiretório `/ho`.
- O **Nginx** funciona como proxy reverso: requisições para `/ho/auth`, `/ho/usuarios`, `/ho/prontuarios`, `/ho/agenda`, `/ho/fila`, `/ho/ofertas` e `/ho/dashboard` são redirecionadas internamente para o container do backend.
- O **CORS** do backend aceita múltiplas origens via variável `CORS_ORIGIN`, já configurada por padrão para desenvolvimento (`:5173`), Docker local (`:8080`) e o domínio de produção da UFPE.

---

## Variáveis de Ambiente

### Backend
Crie um arquivo `.env` dentro de `backend/`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="senha de sua escola"
```

No Docker, as variáveis também podem ser definidas via `docker-compose.yml` (já tem valores padrão configurados, mas sempre prefira sobrescrever `JWT_SECRET` em produção).

### Frontend
Crie um arquivo `.env` dentro de `frontend/`:

```env
VITE_API_URL=http://localhost:3333
```

Essa variável diz ao frontend onde está o backend. O `axiosInstance.ts` lê `VITE_API_URL` e monta a URL base das requisições (`VITE_API_URL + /ho`). Sem ela, o frontend não sabe para onde mandar as chamadas quando rodando via Docker.

> Em desenvolvimento local sem Docker (`npm run dev` no frontend e backend separados), essa variável também é necessária caso o backend não esteja em `localhost:3000` com proxy do Vite — confirme com o time qual o fluxo atual antes de omiti-la.

---

## Banco de Dados

SQLite em desenvolvimento, com schema gerenciado pelo Prisma. Em Docker, o arquivo do banco é persistido no volume `sqlite_data`.

Para visualizar os dados graficamente:
```bash
cd backend
npx prisma studio
```
Abre em `http://localhost:5555`.

### Tabelas
| Tabela | Descrição |
|---|---|
| `Usuario` | Todos os usuários do sistema, com campos específicos por perfil |
| `Prontuario` | Registros clínicos dos atendimentos, com histórico de status |
| `FilaEspera` | Fila de pacientes aguardando atendimento, ordenada por prioridade |
| `Agenda` | Agendamentos de consultas |
| `Oferta` | Vagas de atendimento criadas pelo NAPA |  

---

## Como testar

```bash
cd backend
npm test                # roda todos os testes (Vitest)
npm run test:watch      # modo watch, re-executa ao salvar
npm run test:coverage   # gera relatório de cobertura
```

---

## Estrutura de Pastas

```
ProjetoDS/
├── docker-compose.yml          # Orquestração dos containers
├── backend/
│   ├── Dockerfile
│   ├── prisma/
│   │   ├── schema.prisma      # Modelo do banco de dados
│   │   ├── seed.ts            # Script que cria o primeiro ADMIN
│   │   └── migrations/        # Histórico de migrations
│   ├── src/
│   │   ├── controllers/       # Recebe requisições HTTP e devolve respostas
│   │   ├── services/          # Regras de negócio e validações
│   │   ├── repositories/      # Acesso direto ao banco via Prisma
│   │   ├── routes/            # Definição das rotas da API
│   │   ├── middlewares/       # autenticar e autorizar por perfil
│   │   ├── types/             # Interfaces e tipos TypeScript
│   │   ├── __tests__/         # Testes unitários (Vitest)
│   │   └── lib/               # Instância do Prisma Client
│   └── package.json
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf             # Proxy reverso e SPA fallback em produção
│   ├── src/
│   │   ├── api/               # Chamadas ao backend (Axios)
│   │   ├── components/        # Componentes reutilizáveis de UI
│   │   ├── hooks/             # Hooks customizados de dados
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── routes/            # Roteamento e proteção de rotas por perfil
│   │   ├── stores/            # Estado global (Zustand)
│   │   ├── types/             # Interfaces TypeScript
│   │   └── utils/             # Funções utilitárias
│   └── package.json
└── docs/
    └── adrs/                  # Decisões arquiteturais registradas
```

---

## Rotas da API

### Autenticação
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/auth/login` | Público | Retorna token JWT |

### Usuários
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/usuarios/cadastro` | Autenticado | Cadastra usuário (ADMIN cadastra qualquer perfil) |
| GET | `/usuarios/me` | Autenticado | Dados do usuário logado |
| PUT | `/usuarios/me` | Autenticado | Atualiza dados próprios (pessoais, perfil, senha) |
| GET | `/usuarios` | ADMIN | Lista todos os usuários (aceita `?busca=`) |
| GET | `/usuarios/:id` | ADMIN | Busca usuário por ID |
| PUT | `/usuarios/:id` | ADMIN | Atualiza qualquer usuário |
| DELETE | `/usuarios/:id` | ADMIN | Remove usuário |

### Prontuários
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/prontuarios` | ESTUDANTE | Cria prontuário |
| GET | `/prontuarios` | Autenticado | Lista prontuários (filtrado por perfil, aceita `?status=`) |
| GET | `/prontuarios/:id` | Autenticado | Busca por ID |
| PUT | `/prontuarios/:id` | ESTUDANTE | Edita prontuário não assinado |
| POST | `/prontuarios/:id/assinar` | PROFESSOR | Assina prontuário |

### Fila de Espera
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/fila` | NAPA, ADMIN | Adiciona paciente na fila |
| GET | `/fila` | NAPA, PROFESSOR, ADMIN | Lista fila ordenada por prioridade |
| DELETE | `/fila/:id` | NAPA, ADMIN | Remove paciente da fila |

### Agenda
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/agenda` | Autenticado | Cria agendamento |
| GET | `/agenda` | Autenticado | Lista agendamentos |

### Ofertas
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/ofertas` | Autenticado | Lista todas as ofertas |
| POST | `/ofertas` | NAPA, ADMIN | Cria nova oferta |

### Dashboard
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/dashboard/estudante` | ESTUDANTE | Prontuários do próprio estudante |
| GET | `/dashboard/professor` | PROFESSOR | Todos os prontuários + fila de espera |
| GET | `/dashboard/napa` | NAPA | Fila de espera + ofertas |
| GET | `/dashboard/admin` | ADMIN | Visão completa: prontuários + fila + ofertas + usuários |

---

## Perfis de Acesso

| Perfil | Quem cria | Permissões principais |
|---|---|---|
| ESTUDANTE | Qualquer pessoa autenticada (ou ADMIN) | Criar e editar seus prontuários, editar perfil próprio |
| PROFESSOR | ADMIN/COORDENADOR | Ver todos os prontuários, assinar |
| NAPA | ADMIN/COORDENADOR | Gerenciar fila, agenda e ofertas |
| ADMIN/COORDENADOR | Seed ou outro ADMIN/COORDENADOR | Acesso total, CRUD completo de usuários |

---

## Decisões Arquiteturais (ADRs)

Os ADRs estão em `docs/adrs/`. Decisões registradas:

- **ADR-01** — Uso do SQLite como banco de dados
- **ADR-02** — Arquitetura em 3 camadas (Controller → Service → Repository)
- **ADR-03** — React no frontend com roteamento por perfil
- **ADR-04** — Autenticação stateless com JWT
- **ADR-05** — Tabela única para todos os perfis de usuário
- **ADR-06** — Containerização com Docker e proxy reverso via Nginx

---

## Equipe

Projeto desenvolvido pela **Equipe 7** — CIN0136/UFPE 2026.1

| Nome | Papel |
|---|---|
| Vítor Nunes | Gerente de Projeto |
| João Felipe | Product Owner |
| Davi Mello | Desenvolvedor |
| Davi Carvalho | Desenvolvedor |
| Davi Pedrosa | Desenvolvedor |
| Gabriel Godoy | Desenvolvedor |
| João Pedro | Desenvolvedor |
