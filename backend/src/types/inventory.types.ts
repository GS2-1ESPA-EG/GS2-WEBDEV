// Tipos para itens de carga, estado do inventário e alertas de limiar
export interface Item {
  item_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  mass_kg: number;
  spacecraft_id: string;
  status: ItemStatus;
}

export type ItemStatus = "nominal" | "low" | "critical" | "unknown";

export interface EntityState {
  entity_id: string;
  spacecraft_id: string;
  items: Item[];
  last_event_at: string;
  last_recompute_at: string;
}

export interface Alert {
  alert_id: string;
  spacecraft_id: string;
  item_id: string;
  level: "warning" | "critical";
  message: string;
  triggered_at: string;
}
