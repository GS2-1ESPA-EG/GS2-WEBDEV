// Tipos para análise preditiva: regressão sobre telemetria + relatório gerado por LLM
export interface PredictionRequest {
  spacecraft_id: string;
  horizon_hours: number; // janela de projeção à frente
}

export type RiskLevel = "low" | "medium" | "high";

// Resultado determinístico da regressão linear sobre a série de temperatura de um compartimento
export interface CompartmentProjection {
  compartment_id: string;
  name: string;
  metric: "temperature";
  unit: string; // "°C"
  current_value: number;
  limit: number; // temp_max nominal
  slope_per_hour: number; // °C por hora (tendência)
  r_squared: number; // qualidade do ajuste [0..1]
  breach_in_hours: number | null; // horas até cruzar o limite (null se estável/sem risco)
  points: { t: string; value: number }[]; // histórico (recente)
  forecast: { t: string; value: number }[]; // projeção à frente
}

// Regressão sobre o consumo registrado de um item (baixas ao longo do tempo)
export interface ItemProjection {
  item_id: string;
  name: string;
  compartment_id: string;
  unit: string;
  current_quantity: number;
  capacity: number;
  slope_per_hour: number; // unidades/hora (negativo = consumindo)
  r_squared: number;
  depletion_in_hours: number | null; // horas até zerar (null se estável/sem consumo)
  points: { t: string; value: number }[]; // quantidade restante ao longo do tempo
}

// Relatório final: números da regressão + análise em linguagem natural do Claude
export interface PredictionReport {
  report_id: string;
  spacecraft_id: string;
  spacecraft_name: string;
  generated_at: string;
  model: string; // modelo Claude usado
  horizon_hours: number;
  risk_level: RiskLevel;
  confidence_pct: number; // derivado do R² médio das regressões
  summary: string; // resumo executivo (LLM)
  recommendations: string[]; // ações sugeridas (LLM)
  confidence_note: string; // observação do LLM sobre a confiança
  projections: CompartmentProjection[]; // regressões de telemetria (temperatura)
  item_projections: ItemProjection[]; // regressões de consumo dos itens alterados
}
