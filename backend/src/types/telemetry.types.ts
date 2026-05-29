// Tipos para eventos de telemetria recebidos do FIWARE Orion Context Broker
export interface Event {
  event_id: string;
  event_type: string;
  source: string;
  spacecraft_id: string;
  timestamp: string;
  received_at: string;
  envelope_id?: string;
  payload: Record<string, unknown>;
}

export interface TelemetryPayload {
  subscriptionId: string;
  data: OrionEntity[];
}

export interface OrionEntity {
  id: string;
  type: string;
  [key: string]: OrionAttribute | string;
}

export interface OrionAttribute {
  type: string;
  value: unknown;
  metadata?: Record<string, unknown>;
}
