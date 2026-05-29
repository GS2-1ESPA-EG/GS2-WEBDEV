// Gera análise preditiva: regressão linear sobre a telemetria + relatório via Anthropic SDK
import { randomUUID } from "node:crypto";
import { anthropic } from "../config/anthropic.js";
import type {
  PredictionRequest,
  PredictionReport,
  CompartmentProjection,
  ItemProjection,
  RiskLevel,
} from "../types/prediction.types.js";
import type { CompartmentReading } from "../types/telemetry.types.js";
import { getSpacecraftDetail } from "./fleet.service.js";
import { getEvents } from "./telemetry.service.js";

const MODEL = "claude-opus-4-8"; // troque por "claude-haiku-4-5" para reduzir custo
const MAX_POINTS = 120; // janela recente usada na regressão e no gráfico

// Formato que o Claude deve devolver (structured outputs garante JSON válido)
interface LlmReport {
  risk_level: RiskLevel;
  summary: string;
  recommendations: string[];
  confidence_note: string;
}

const REPORT_SCHEMA = {
  type: "object",
  properties: {
    risk_level: { type: "string", enum: ["low", "medium", "high"] },
    summary: { type: "string" },
    recommendations: { type: "array", items: { type: "string" } },
    confidence_note: { type: "string" },
  },
  required: ["risk_level", "summary", "recommendations", "confidence_note"],
  additionalProperties: false,
} as const;

export async function generate(
  request: PredictionRequest
): Promise<PredictionReport> {
  const { spacecraft_id, horizon_hours } = request;

  const detail = await getSpacecraftDetail(spacecraft_id);
  if (!detail) {
    const err = new Error(`Nave ${spacecraft_id} não encontrada`) as Error & {
      status?: number;
    };
    err.status = 404;
    throw err;
  }

  const events = await getEvents(spacecraft_id);
  const sensored = detail.compartments.filter((c) => c.has_sensor);

  // 1) Regressão determinística por compartimento com sensor
  const projections: CompartmentProjection[] = [];
  for (const compartment of sensored) {
    const readings = events
      .filter(
        (e) =>
          (e.payload as unknown as CompartmentReading).compartment_id ===
          compartment.compartment_id
      )
      .map((e) => e.payload as unknown as CompartmentReading)
      .slice(-MAX_POINTS);
    if (readings.length < 2) continue;

    const t0 = new Date(readings[0].timestamp).getTime();
    const xy = readings.map((r) => ({
      x: (new Date(r.timestamp).getTime() - t0) / 3_600_000, // horas desde o início
      y: r.current_temp,
    }));
    const fit = linregress(xy);
    if (!fit) continue;

    const last = readings[readings.length - 1];
    const current = last.current_temp;
    const limit = last.temp_max;
    const lastX = xy[xy.length - 1].x;

    // horas até cruzar o limite, se a tendência for de subida e ainda abaixo do limite
    const breach =
      fit.slope > 1e-6 && current < limit ? (limit - current) / fit.slope : null;

    // pontos de projeção à frente
    const forecast: { t: string; value: number }[] = [];
    const steps = 12;
    for (let i = 0; i <= steps; i++) {
      const x = lastX + (horizon_hours * i) / steps;
      forecast.push({
        t: new Date(t0 + x * 3_600_000).toISOString(),
        value: round(fit.slope * x + fit.intercept),
      });
    }

    projections.push({
      compartment_id: compartment.compartment_id,
      name: compartment.name,
      metric: "temperature",
      unit: "°C",
      current_value: round(current),
      limit,
      slope_per_hour: round(fit.slope),
      r_squared: round(fit.r2, 3),
      breach_in_hours: breach === null ? null : round(breach, 1),
      points: readings.map((r) => ({ t: r.timestamp, value: r.current_temp })),
      forecast,
    });
  }

  // 1b) Regressão de consumo por item — apenas itens que sofreram baixa (eventos de consumo)
  const consumptionEvents = events.filter((e) => e.event_type === "consumption");
  const seriesByItem = new Map<string, { t: string; qty: number }[]>();
  for (const e of consumptionEvents) {
    const p = e.payload as unknown as { item_id: string; quantity_after: number };
    const arr = seriesByItem.get(p.item_id) ?? [];
    arr.push({ t: e.timestamp, qty: p.quantity_after });
    seriesByItem.set(p.item_id, arr);
  }
  const itemById = new Map(
    detail.compartments.flatMap((c) => c.items).map((i) => [i.item_id, i])
  );

  const itemProjections: ItemProjection[] = [];
  for (const [itemId, series] of seriesByItem) {
    const item = itemById.get(itemId);
    if (!item || series.length < 2) continue;

    const t0 = new Date(series[0].t).getTime();
    const xy = series.map((s) => ({
      x: (new Date(s.t).getTime() - t0) / 3_600_000,
      y: s.qty,
    }));
    const fit = linregress(xy);
    if (!fit) continue;

    const depletion = fit.slope < -1e-6 ? item.quantity / -fit.slope : null;
    itemProjections.push({
      item_id: itemId,
      name: item.name,
      compartment_id: item.compartment_id,
      unit: item.unit,
      current_quantity: item.quantity,
      capacity: item.capacity,
      slope_per_hour: round(fit.slope, 3),
      r_squared: round(fit.r2, 3),
      depletion_in_hours: depletion === null ? null : round(depletion, 1),
      points: series.map((s) => ({ t: s.t, value: s.qty })),
    });
  }

  const allR2 = [
    ...projections.map((p) => p.r_squared),
    ...itemProjections.map((p) => p.r_squared),
  ];
  const confidence_pct =
    allR2.length > 0
      ? Math.round((allR2.reduce((s, r) => s + r, 0) / allR2.length) * 100)
      : 50;

  // 2) Contexto compacto para o LLM
  const totalItems = detail.compartments.reduce((n, c) => n + c.item_count, 0);
  const criticalItems = detail.compartments
    .flatMap((c) => c.items)
    .filter((i) => i.status === "critical" || i.status === "low")
    .map((i) => `${i.name} (${i.status}, ${i.quantity} ${i.unit})`);

  const context = {
    spacecraft: { id: detail.spacecraft_id, name: detail.name, mission: detail.mission, crew: detail.crew_count },
    horizon_hours,
    inventory: { total_units: totalItems, at_risk_items: criticalItems },
    compartments: sensored.map((c) => ({
      id: c.compartment_id,
      name: c.name,
      status: c.state?.status ?? "unknown",
      alerts: c.state?.alerts.map((a) => a.message) ?? [],
      current_temp: c.state?.reading.current_temp,
      temp_range: [c.temp_min, c.temp_max],
      current_humidity: c.state?.reading.current_humidity,
    })),
    regressions: projections.map((p) => ({
      compartment: p.compartment_id,
      current_temp: p.current_value,
      limit: p.limit,
      slope_per_hour: p.slope_per_hour,
      r_squared: p.r_squared,
      breach_in_hours: p.breach_in_hours,
    })),
    // Itens que sofreram consumo recente — foco principal da análise
    changed_items: itemProjections.map((p) => ({
      item: p.name,
      compartment: p.compartment_id,
      current: p.current_quantity,
      capacity: p.capacity,
      unit: p.unit,
      slope_per_hour: p.slope_per_hour,
      depletion_in_hours: p.depletion_in_hours,
      r_squared: p.r_squared,
    })),
  };

  // 3) Chamada ao Claude com structured outputs (JSON Schema) e prompt caching no system
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content:
          "Analise os dados a seguir da missão e produza o relatório preditivo.\n\n" +
          JSON.stringify(context, null, 2),
      },
    ],
    output_config: { format: { type: "json_schema", schema: REPORT_SCHEMA } },
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const parsed: LlmReport =
    textBlock && textBlock.type === "text"
      ? (JSON.parse(textBlock.text) as LlmReport)
      : {
          risk_level: "low",
          summary: "Não foi possível gerar a análise.",
          recommendations: [],
          confidence_note: "",
        };

  return {
    report_id: randomUUID(),
    spacecraft_id: detail.spacecraft_id,
    spacecraft_name: detail.name,
    generated_at: new Date().toISOString(),
    model: MODEL,
    horizon_hours,
    risk_level: parsed.risk_level,
    confidence_pct,
    summary: parsed.summary,
    recommendations: parsed.recommendations,
    confidence_note: parsed.confidence_note,
    projections,
    item_projections: itemProjections,
  };
}

const SYSTEM_PROMPT = `Você é o sistema de análise preditiva da missão Cápsula Dragon da SpaceX (projeto OrbitStock).
Recebe dados reais de telemetria, resultados de regressão linear e o inventário de carga de uma cápsula, e produz uma análise executiva em português (pt-BR) para o engenheiro de controle de missão.

Diretrizes:
- Seja conciso, técnico e acionável.
- Baseie-se APENAS nos dados fornecidos; nunca invente números ou itens.
- PRIORIZE a análise dos itens em "changed_items" (itens que sofreram consumo registrado): projete a depleção (depletion_in_hours), compare com o horizonte e recomende reabastecimento/racionamento quando o esgotamento for próximo. Se "changed_items" estiver vazio, analise o panorama geral do inventário.
- Classifique o risco como "high" se houver violação de faixa iminente (breach_in_hours pequeno), alertas críticos ativos ou itens de inventário em estado crítico; "medium" para tendências preocupantes ou itens em baixa; "low" quando tudo estiver nominal.
- Em "summary": 2 a 4 frases com o panorama geral, citando temperaturas, tendências e prazos relevantes.
- Em "recommendations": de 2 a 5 ações curtas e priorizadas.
- Em "confidence_note": uma frase explicando a confiança da previsão com base no R² das regressões e na quantidade de dados.`;

// --- Regressão linear por mínimos quadrados --- //
function linregress(
  pts: { x: number; y: number }[]
): { slope: number; intercept: number; r2: number } | null {
  const n = pts.length;
  if (n < 2) return null;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const { x, y } of pts) {
    sx += x;
    sy += y;
    sxx += x * x;
    sxy += x * y;
  }
  const denom = n * sxx - sx * sx;
  if (denom === 0) return { slope: 0, intercept: sy / n, r2: 1 }; // x constante
  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;

  const meanY = sy / n;
  let ssRes = 0, ssTot = 0;
  for (const { x, y } of pts) {
    const yhat = slope * x + intercept;
    ssRes += (y - yhat) ** 2;
    ssTot += (y - meanY) ** 2;
  }
  const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);
  return { slope, intercept, r2 };
}

function round(n: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}
