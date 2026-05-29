// Tipos espelhando as respostas da API do backend OrbitStock

export type CompartmentStatus = "nominal" | "warning" | "critical";

export interface CompartmentReading {
  entity_id: string;
  compartment_id: string;
  spacecraft_id: string;
  name: string;
  category: string;
  current_temp: number;
  current_humidity: number;
  temp_min: number;
  temp_max: number;
  humidity_max: number;
  is_open: boolean;
  last_impact_g: number;
  last_light_level: number;
  severity: string;
  timestamp: string;
}

export interface Alert {
  alert_id: string;
  spacecraft_id: string;
  compartment_id: string;
  type: "temperature" | "humidity" | "door" | "impact";
  level: "warning" | "critical";
  message: string;
  triggered_at: string;
}

export interface CompartmentState {
  entity_id: string;
  spacecraft_id: string;
  compartment_id: string;
  reading: CompartmentReading;
  status: CompartmentStatus;
  alerts: Alert[];
  last_event_at: string;
  last_recompute_at: string;
}

export interface Item {
  item_id: string;
  spacecraft_id: string;
  compartment_id: string;
  name: string;
  category: string;
  quantity: number;
  capacity: number;
  unit: string;
  mass_kg: number;
  code: string;
  expiry: string;
  status: "nominal" | "low" | "critical" | "unknown";
}

export interface FleetSummary {
  spacecraft_id: string;
  name: string;
  mission: string;
  crew_count: number;
  active: boolean;
  compartment_count: number;
  item_count: number;
  status: CompartmentStatus;
  active_alerts: number;
  critical_alerts: number;
  warning_alerts: number;
  sensored_compartments: number;
  nominal_compartments: number;
}

export interface CompartmentDetail {
  spacecraft_id: string;
  compartment_id: string;
  name: string;
  category: string;
  temp_min: number;
  temp_max: number;
  humidity_max: number;
  has_sensor: boolean;
  state: CompartmentState | null;
  items: Item[];
  item_count: number;
}

export interface SpacecraftDetail {
  spacecraft_id: string;
  name: string;
  mission: string;
  crew_count: number;
  active: boolean;
  compartments: CompartmentDetail[];
}

export interface TelemetryEvent {
  event_id: string;
  event_type: string;
  source: string;
  spacecraft_id: string;
  timestamp: string;
  received_at: string;
  envelope_id?: string;
  payload: CompartmentReading;
}

export type RiskLevel = "low" | "medium" | "high";

export interface CompartmentProjection {
  compartment_id: string;
  name: string;
  metric: "temperature";
  unit: string;
  current_value: number;
  limit: number;
  slope_per_hour: number;
  r_squared: number;
  breach_in_hours: number | null;
  points: { t: string; value: number }[];
  forecast: { t: string; value: number }[];
}

export interface ItemProjection {
  item_id: string;
  name: string;
  compartment_id: string;
  unit: string;
  current_quantity: number;
  capacity: number;
  slope_per_hour: number;
  r_squared: number;
  depletion_in_hours: number | null;
  points: { t: string; value: number }[];
}

export interface PredictionReport {
  report_id: string;
  spacecraft_id: string;
  spacecraft_name: string;
  generated_at: string;
  model: string;
  horizon_hours: number;
  risk_level: RiskLevel;
  confidence_pct: number;
  summary: string;
  recommendations: string[];
  confidence_note: string;
  projections: CompartmentProjection[];
  item_projections: ItemProjection[];
}
