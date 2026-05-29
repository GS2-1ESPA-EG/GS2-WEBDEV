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

// Leitura de um compartimento da nave, extraída de uma OrionEntity do tipo "Compartment".
// Reflete exatamente os atributos publicados pelo ESP32 via FIWARE Orion.
export interface CompartmentReading {
  entity_id: string;        // urn:ngsi-ld:Compartment:DRAGON-C209:M-03
  compartment_id: string;   // M-03
  spacecraft_id: string;    // DRAGON-C209
  name: string;             // "Medico refrigerado"
  category: string;         // "medical"
  current_temp: number;     // °C
  current_humidity: number; // %
  temp_min: number;         // limite inferior nominal de temperatura
  temp_max: number;         // limite superior nominal de temperatura
  humidity_max: number;     // limite superior nominal de umidade
  is_open: boolean;         // porta aberta?
  last_impact_g: number;    // último impacto medido (G)
  last_light_level: number; // nível de luz (detecta porta aberta)
  severity: string;         // severidade calculada no edge: nominal | warning | critical
  timestamp: string;        // TimeInstant da entidade (ISO 8601)
}
