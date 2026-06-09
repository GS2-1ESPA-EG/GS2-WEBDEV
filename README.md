# OrbitStock — Sistema de Gerenciamento de Carga Espacial

Sistema de monitoramento e controle de inventário para a cápsula **Dragon C209** (missão CRS-31). Integra telemetria em tempo real de um ESP32 simulado no Wokwi via FIWARE Orion, dashboard de controle de missão e análise preditiva com IA (Anthropic Claude).

---

## Deploy

| Serviço | URL |
|---|---|
| **Frontend (Vercel)** | https://gs-2-webdev.vercel.app |
| **Backend (Render)** | https://gs2-webdev.onrender.com |

> O backend free tier dorme após 15 min de inatividade — a primeira requisição pode demorar ~30s para acordar.

---

## Equipe

| Nome | RM |
|---|---|
| Enrico Dellatorre | 566824 |
| Gustavo Hiruo | 567625 |

---

## Instalação e execução local

### Pré-requisitos

| Requisito | Versão mínima | Observação |
|-----------|--------------|------------|
| Node.js | **22 ou superior** | O banco de dados usa `node:sqlite`, módulo nativo do Node 22 |
| npm | 10+ | Incluído no Node 22 |
| Chave Anthropic | — | Necessária para o módulo de previsão IA |

---

### 1. Clonar o repositório

```bash
git clone https://github.com/GS2-1ESPA-EG/GS2-WEBDEV.git
cd GS2-WEBDEV
```

---

### 2. Instalar dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 3. Configurar variáveis de ambiente

Crie o arquivo `backend/.env`:

```env
PORT=3000
NODE_ENV=development
DB_PATH=./orbitstock.db
ANTHROPIC_API_KEY=sk-ant-...
ORION_URL=http://158.23.61.7:1026/
```

---

### 4. Popular o banco de dados

```bash
cd backend
npm run seed
```

Saída esperada:

```
Seed concluído para DRAGON-C209:
  12 compartimentos
  39 itens distintos (1138 unidades no total)
```

> O seed é **idempotente** — pode ser rodado mais de uma vez sem duplicar dados.

---

### 5. Subir o backend

```bash
cd backend
npm run dev
```

---

### 6. Subir o frontend

```bash
cd frontend
npm run dev
```

Acesse **http://localhost:5173**

---

## Arquitetura

```
┌─────────────────────┐        polling 3s       ┌──────────────────────┐
│   Wokwi (ESP32)     │──► FIWARE Orion ────────►│  Backend Express     │
│   Simulador IoT     │        NGSIv2            │  Node.js + TypeScript│
└─────────────────────┘                          │  SQLite (node:sqlite)│
                                                 │  Anthropic SDK       │
                                                 └──────────┬───────────┘
                                                            │ REST API :3000
                                                 ┌──────────▼───────────┐
                                                 │  Frontend React      │
                                                 │  Vite + TypeScript   │
                                                 │  React Router DOM    │
                                                 │  Recharts            │
                                                 │  :5173               │
                                                 └──────────────────────┘
```

---

## Estrutura do projeto

```
GS2-WEBDEV/
├── backend/
│   ├── src/
│   │   ├── config/          # env.ts, anthropic.ts
│   │   ├── controllers/     # fleet, inventory, item, prediction, telemetry
│   │   ├── middleware/      # logger, errorHandler
│   │   ├── repositories/    # db.ts + acesso SQLite
│   │   ├── routes/          # fleet, inventory, item, prediction, telemetry
│   │   ├── services/        # alert, fleet, inventory, item, orion-poller, prediction, telemetry
│   │   ├── types/           # fleet, inventory, prediction, telemetry
│   │   ├── seed.ts
│   │   └── server.ts
│   └── .env                 # variáveis de ambiente (não versionado)
│
└── frontend/
    └── src/
        ├── api/             # client.ts, types.ts
        ├── pages/           # páginas de conteúdo
        │   ├── Problema.tsx
        │   ├── Tecnologia.tsx
        │   ├── Objetivos.tsx
        │   ├── Beneficios.tsx
        │   ├── Aplicacao.tsx
        │   └── pages.css
        └── components/
            ├── Layout.tsx           # sidebar + outlet + footer
            ├── Sidebar.tsx          # navegação com React Router NavLink
            ├── Footer.tsx           # rodapé padrão
            ├── Dashboard.tsx        # controle de missão
            ├── PredictionView.tsx   # análise preditiva com IA
            ├── AstronautApp.tsx     # inventário de bordo
            ├── KpiCards.tsx
            ├── FleetCard.tsx
            ├── TelemetryChart.tsx
            ├── CompartmentsCharts.tsx
            └── PredictionChart.tsx
```

---

## Páginas

### Conteúdo (estáticas)

| Rota | Página |
|---|---|
| `/problema` | O problema de gerenciar suprimentos em missões espaciais |
| `/tecnologia` | Stack técnica e arquitetura do sistema |
| `/objetivos` | Objetivos do OrbitStock |
| `/beneficios` | Benefícios para tripulação e operações |
| `/aplicacao` | Aplicação no dia a dia da missão |

### Sistema (integradas com API)

| Rota | Página |
|---|---|
| `/dashboard` | Controle de missão — KPIs, frota, telemetria |
| `/predicao` | Análise preditiva com IA (Claude) |
| `/inventario` | Inventário de bordo — visão do astronauta |

---

## Funcionalidades

### Dashboard — Controle de Missão

- KPIs em tempo real (naves ativas, alertas críticos, saúde da frota)
- Cards por nave com status agregado
- Gráfico de telemetria das últimas 6 horas
- Gráficos por compartimento
- Atualização automática a cada 5 segundos

### Previsão IA

- Regressão linear sobre histórico de telemetria
- Relatório em linguagem natural gerado pelo **Claude** (Anthropic)
- Nível de risco, resumo executivo, recomendações e nota de confiança
- Gráfico de projeção com histórico + forecast

### Inventário de Bordo

- Interface dark simulando tablet de bordo
- Cronômetro T+ de missão em tempo real
- Busca e filtro por categoria
- Baixa de consumo com atualização imediata
- Painel de alertas com opção de resolução

---

## API REST

Base URL: `http://localhost:3000/api`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/fleet` | Lista naves com KPIs |
| GET | `/fleet/:spacecraftId` | Detalhe da nave |
| GET | `/telemetry/events/:spacecraftId` | Eventos de telemetria |
| POST | `/predictions/generate` | Gera relatório preditivo |
| GET | `/inventory/:spacecraftId` | Estado dos compartimentos |
| GET | `/items/:spacecraftId` | Itens da nave |
| POST | `/items/:itemId/consume` | Registra consumo |

---

## Scripts

### Backend

```bash
npm run dev        # servidor em modo watch
npm run build      # compila TypeScript para dist/
npm run start      # roda o build compilado
npm run start:prod # seed + start (usado no Render)
npm run seed       # popula o banco de dados
```

### Frontend

```bash
npm run dev     # servidor de desenvolvimento Vite
npm run build   # build de produção
npm run preview # pré-visualiza o build
npm run lint    # ESLint
```

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19, TypeScript, Vite, React Router DOM, Recharts |
| Estilo | CSS3, Flexbox, Google Fonts (Inter + Space Grotesk), CSS Variables |
| Backend | Node.js 22, Express 5, TypeScript |
| Banco de dados | SQLite via `node:sqlite` |
| IA | Anthropic Claude (`@anthropic-ai/sdk`) |
| IoT | FIWARE Orion Context Broker, NGSIv2 |
| Deploy | Vercel (frontend) + Render (backend) |
| Validação | Zod |
| Simulação | Wokwi (ESP32) |
