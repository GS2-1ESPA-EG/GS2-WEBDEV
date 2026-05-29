# OrbitStock — Sistema de Gerenciamento de Carga Espacial

Sistema de monitoramento e controle de inventário para a cápsula **Dragon C209** (missão CRS-31). Integra telemetria em tempo real de um ESP32 simulado no Wokwi via FIWARE Orion, dashboard de controle de missão e análise preditiva com IA (Anthropic Claude).

---

## Equipe:

| Nome | RM |
|---|---|
| Enrico Dellatorre | 566824 |
| Gustavo Hiruo | 567625 |

---

## Instalação e execução

### Pré-requisitos

| Requisito | Versão mínima | Observação |
|-----------|--------------|------------|
| Node.js | **22 ou superior** | O banco de dados usa `node:sqlite`, módulo nativo do Node 22 |
| npm | 10+ | Incluído no Node 22 |
| Chave Anthropic | — | Necessária para o módulo de previsão IA |
| FIWARE Orion | — | VM ou instância com a entidade `urn:ngsi-ld:Compartment:DRAGON-C209:M-03` |

---

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
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

Crie o arquivo `backend/.env` com base no exemplo:

```bash
cp backend/.env.example backend/.env
```

Abra `backend/.env` e preencha os valores:

```env
PORT=3000
NODE_ENV=development
DB_PATH=./data/orbitstock.db
ANTHROPIC_API_KEY=sk-ant-...        # sua chave real da Anthropic
ORION_URL=http://<ip-da-vm>:1026/   # endereço do FIWARE Orion
```

---

### 4. Popular o banco de dados (seed)

O seed cria a nave **DRAGON-C209**, seus 12 compartimentos e 39 tipos de itens de carga:

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

Saída esperada:

```
OrbitStock backend rodando em http://localhost:3000
[Orion Poller] Iniciando polling a cada 3000ms em http://<orion-url>
[Orion Poller] urn:ngsi-ld:Compartment:DRAGON-C209:M-03 atualizado em ...
```

---

### 6. Subir o frontend

Em um novo terminal:

```bash
cd frontend
npm run dev
```

Saída esperada:

```
VITE v8.x  ready in Xms
➜  Local:   http://localhost:5173/
```

---

### 7. Acessar a aplicação

Abra o navegador em **http://localhost:5173**

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
                                                 │  Recharts            │
                                                 │  :5173               │
                                                 └──────────────────────┘
```

### Fluxo de dados

1. O ESP32 no Wokwi publica leituras de sensores no FIWARE Orion (temperatura, umidade, impacto, porta)
2. O backend faz polling no Orion a cada 3 segundos e persiste os eventos no SQLite
3. A cada novo evento, o estado do compartimento é recalculado e alertas são gerados automaticamente
4. O frontend consome a API REST e atualiza o dashboard a cada 5 segundos

---

## Estrutura do projeto

```
GS2-WEBDEV/
├── backend/
│   ├── src/
│   │   ├── config/          # env.ts, anthropic.ts
│   │   ├── controllers/     # fleet, inventory, item, prediction, telemetry
│   │   ├── middleware/       # logger, errorHandler
│   │   ├── repositories/    # db.ts + acesso SQLite (spacecraft, compartments, items, events, state)
│   │   ├── routes/          # fleet, inventory, item, prediction, telemetry
│   │   ├── services/        # alert, fleet, inventory, item, orion-poller, prediction, telemetry
│   │   ├── types/           # fleet.types, inventory.types, prediction.types, telemetry.types
│   │   ├── seed.ts          # popular banco com Dragon C209
│   │   └── server.ts        # ponto de entrada
│   ├── data/                # orbitstock.db (criado na primeira execução)
│   └── .env                 # variáveis de ambiente (não versionado)
│
└── frontend/
    └── src/
        ├── api/             # client.ts (HTTP), types.ts
        └── components/
            ├── Dashboard.tsx        # tela principal de controle de missão
            ├── PredictionView.tsx   # análise preditiva com IA
            ├── AstronautApp.tsx     # inventário de bordo (visão do astronauta)
            ├── Sidebar.tsx
            ├── KpiCards.tsx
            ├── FleetCard.tsx
            ├── TelemetryChart.tsx
            ├── CompartmentsCharts.tsx
            └── PredictionChart.tsx
```

---

## Funcionalidades

### Dashboard — Controle de Missão

- Visão geral da frota com KPIs em tempo real (naves ativas, alertas críticos, compartimentos monitorados)
- Cards individuais por nave com status de saúde agregado
- Gráfico de telemetria das últimas 6 horas (temperatura e umidade do compartimento M-03)
- Gráficos por compartimento com status individual
- Atualização automática a cada 5 segundos

### Previsão IA

- Regressão linear sobre o histórico de telemetria para projetar tendências de temperatura
- Análise de consumo de itens e projeção de depleção de estoque
- Relatório em linguagem natural gerado pelo **Claude** (Anthropic) com:
  - Nível de risco (baixo / médio / alto)
  - Resumo executivo
  - Recomendações priorizadas
  - Nota de confiança baseada no R² das regressões
- Gráfico de projeção com dados históricos e forecast

### Inventário de Bordo (visão do astronauta)

- Interface dark simulando tablet de bordo da Dragon
- Cronômetro T+ de missão em tempo real
- Listagem completa dos 39 tipos de itens distribuídos nos 12 compartimentos
- Busca por nome, código ou compartimento
- Filtro por categoria (médico, alimentação, água, ciência, equipamentos, etc.)
- Baixa de consumo de itens com atualização imediata do estoque
- Painel de alertas ativos com opção de resolução

### Sistema de Alertas

Alertas gerados automaticamente a cada leitura do sensor:

| Tipo | Warning | Critical |
|------|---------|----------|
| Temperatura | Próxima dos limites (±10%) | Fora da faixa nominal |
| Umidade | ≥ 90% do máximo | Acima do máximo |
| Porta | Compartimento aberto | — |
| Impacto | ≥ 3G | ≥ 5G |

---

## API REST

Base URL: `http://localhost:3000/api`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/fleet` | Lista todas as naves com KPIs agregados |
| GET | `/fleet/:spacecraftId` | Detalhe da nave com compartimentos e itens |
| GET | `/telemetry/events/:spacecraftId` | Eventos de telemetria (query param `?since=ISO`) |
| POST | `/predictions/generate` | Gera relatório preditivo com IA |
| GET | `/inventory/:spacecraftId` | Estado atual de todos os compartimentos |
| GET | `/items/:spacecraftId` | Lista de itens da nave |
| POST | `/items/:itemId/consume` | Registra consumo de um item (`{ amount }`) |

---

## Integração FIWARE Orion / Wokwi

O backend faz polling a cada 3 segundos na entidade:

```
urn:ngsi-ld:Compartment:DRAGON-C209:M-03
```

Atributos esperados na entidade NGSIv2:

```json
{
  "id": "urn:ngsi-ld:Compartment:DRAGON-C209:M-03",
  "type": "Compartment",
  "TimeInstant":       { "type": "DateTime", "value": "2026-05-29T..." },
  "spacecraft_id":     { "type": "Text",     "value": "DRAGON-C209" },
  "compartment_id":    { "type": "Text",     "value": "M-03" },
  "current_temp":      { "type": "Number",   "value": 4.0 },
  "current_humidity":  { "type": "Number",   "value": 47.5 },
  "temp_min":          { "type": "Number",   "value": 2 },
  "temp_max":          { "type": "Number",   "value": 8 },
  "humidity_max":      { "type": "Number",   "value": 80 },
  "is_open":           { "type": "Boolean",  "value": false },
  "last_impact_g":     { "type": "Number",   "value": 1.0 },
  "last_light_level":  { "type": "Number",   "value": 1001 },
  "severity":          { "type": "Text",     "value": "nominal" }
}
```

O header `fiware-service: smart` é enviado em todas as requisições ao Orion.

---

## Scripts disponíveis

### Backend

```bash
npm run dev    # servidor em modo watch (tsx)
npm run build  # compila TypeScript para dist/
npm run start  # roda o build compilado
npm run seed   # popula o banco de dados
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
| Frontend | React 19, TypeScript, Vite, Recharts |
| Backend | Node.js 22, Express 5, TypeScript, tsx |
| Banco de dados | SQLite via `node:sqlite` (nativo, sem dependência externa) |
| IA | Anthropic Claude (`@anthropic-ai/sdk`) |
| IoT | FIWARE Orion Context Broker, NGSIv2 |
| Validação | Zod |
| Simulação | Wokwi (ESP32) |
