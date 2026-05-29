# OrbitStock Backend

API REST para gestão de inventário de carga da Cápsula Dragon (SpaceX). Recebe telemetria do FIWARE Orion, persiste eventos em SQLite e gera análises preditivas via Anthropic API.

## Requisitos

- Node.js 20+
- npm 10+

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env e preencher ANTHROPIC_API_KEY

# 3. Iniciar em modo desenvolvimento
npm run dev
```

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor com hot reload via tsx |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Executa build compilado |

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/telemetry/notify` | Callback para notificações do Orion |
| `GET` | `/api/telemetry/events/:spacecraftId` | Lista eventos de uma nave |
| `GET` | `/api/inventory/:spacecraftId` | Estado atual do inventário |
| `GET` | `/api/inventory/:spacecraftId/alerts` | Alertas de limiar ativos |
| `POST` | `/api/predictions/generate` | Gera análise preditiva via Anthropic |

## Estrutura

```
src/
├── server.ts              # Entry point — Express + middlewares
├── config/
│   ├── env.ts             # Validação de env vars com Zod
│   └── anthropic.ts       # Cliente Anthropic SDK
├── routes/                # Roteadores Express (sem lógica)
├── controllers/           # Validação de input + chamada de services
├── services/              # Lógica de negócio
│   ├── telemetry.service  # Processa notificações do Orion
│   ├── inventory.service  # Mantém estado atual do inventário
│   ├── prediction.service # Análise preditiva via Anthropic
│   └── alert.service      # Avalia limiares críticos
├── repositories/
│   ├── db.ts              # Singleton SQLite (better-sqlite3)
│   ├── event.repository   # CRUD na tabela events
│   └── state.repository   # CRUD na tabela current_state
├── types/                 # Interfaces TypeScript
└── middleware/
    ├── errorHandler.ts    # Formata erros em JSON
    └── logger.ts          # Loga método, path, status, duração
data/                      # Arquivo .db gerado aqui (gitignored)
```
