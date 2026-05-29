// Tipos para requisições e relatórios de análise preditiva via Anthropic
export interface PredictionRequest {
  spacecraft_id: string;
  horizon_days: number;
  items?: string[];
}

export interface PredictionReport {
  report_id: string;
  spacecraft_id: string;
  generated_at: string;
  horizon_days: number;
  summary: string;
  predictions: ItemPrediction[];
  recommendations: string[];
  raw_analysis: string;
}

export interface ItemPrediction {
  item_id: string;
  item_name: string;
  current_quantity: number;
  predicted_quantity: number;
  depletion_date?: string;
  confidence: "high" | "medium" | "low";
  trend: "stable" | "decreasing" | "increasing";
}
