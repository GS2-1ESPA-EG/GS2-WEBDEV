// Tipos para itens de carga (inventário SQLite), estado dos compartimentos e alertas
import type { CompartmentReading } from "./telemetry.types.js";

// --- Inventário de itens (camada gerenciada apenas no SQLite, independente da VM) --- //
export interface Item {
  item_id: string;
  name: string;
  category: string;
  quantity: number;
  capacity: number; // quantidade nominal/máxima (para o medidor "quantidade/capacidade")
  unit: string;
  mass_kg: number;
  spacecraft_id: string;
  compartment_id: string; // compartimento onde o item está estivado
  code: string; // código de carga (ex.: H2O-082)
  expiry: string; // validade (ex.: "12/2027"; vazio quando não se aplica)
  status: ItemStatus;
}

export type ItemStatus = "nominal" | "low" | "critical" | "unknown";

// --- Estado atual derivado da telemetria da VM (um por compartimento) --- //
export type CompartmentStatus = "nominal" | "warning" | "critical";

export interface CompartmentState {
  entity_id: string;             // chave do current_state: `${spacecraft_id}:${compartment_id}`
  spacecraft_id: string;
  compartment_id: string;
  reading: CompartmentReading;   // última leitura conhecida do compartimento
  status: CompartmentStatus;     // pior nível entre os alertas ativos
  alerts: Alert[];               // alertas ativos derivados da última leitura
  last_event_at: string;         // timestamp da leitura
  last_recompute_at: string;     // quando o estado foi recalculado
}

// --- Alertas de limiar avaliados sobre a leitura do compartimento --- //
export interface Alert {
  alert_id: string;
  spacecraft_id: string;
  compartment_id: string;
  type: "temperature" | "humidity" | "door" | "impact";
  level: "warning" | "critical";
  message: string;
  triggered_at: string;
}
