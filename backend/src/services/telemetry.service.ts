// Processa notificações do Orion: mapeia entidades Compartment para eventos e persiste no banco
import type {
  TelemetryPayload,
  OrionEntity,
  OrionAttribute,
  CompartmentReading,
  Event,
} from "../types/telemetry.types.js";
import { insertEvent, findEventsBySpacecraft } from "../repositories/event.repository.js";
import * as InventoryService from "./inventory.service.js";

export async function processNotification(payload: TelemetryPayload): Promise<void> {
  const affectedSpacecraft = new Set<string>();

  for (const entity of payload.data) {
    // Só nos interessam entidades de compartimento publicadas pelo ESP32
    if (entity.type !== "Compartment") continue;

    const reading = parseCompartment(entity);
    if (!reading) continue;

    // event_id determinístico (entidade + timestamp) garante idempotência:
    // se o mesmo ciclo de polling reentregar a leitura, o ON CONFLICT DO NOTHING ignora
    const event: Event = {
      event_id: `${reading.entity_id}:${reading.timestamp}`,
      event_type: "compartment_reading",
      source: payload.subscriptionId,
      spacecraft_id: reading.spacecraft_id,
      timestamp: reading.timestamp,
      received_at: new Date().toISOString(),
      envelope_id: payload.subscriptionId,
      payload: { ...reading },
    };

    insertEvent(event);
    affectedSpacecraft.add(reading.spacecraft_id);
  }

  // Recalcula o estado atual (e os alertas) de cada nave afetada
  for (const spacecraftId of affectedSpacecraft) {
    await InventoryService.recomputeState(spacecraftId);
  }
}

export async function getEvents(
  spacecraftId: string,
  sinceTimestamp?: string
): Promise<Event[]> {
  return findEventsBySpacecraft(spacecraftId, sinceTimestamp);
}

// --- Helpers de parsing das OrionEntity (formato NGSIv2) --- //

// Lê o `value` de um atributo NGSIv2 ({ type, value, metadata }) da entidade.
function attrValue(entity: OrionEntity, key: string): unknown {
  const attr = entity[key];
  if (attr && typeof attr === "object" && "value" in attr) {
    return (attr as OrionAttribute).value;
  }
  return undefined;
}

function toNumber(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function toString(v: unknown): string {
  return v == null ? "" : String(v);
}

function toBoolean(v: unknown): boolean {
  return v === true || v === "true";
}

// Converte uma OrionEntity do tipo "Compartment" numa leitura tipada.
// Retorna null se faltar identidade mínima (timestamp ou spacecraft_id).
function parseCompartment(entity: OrionEntity): CompartmentReading | null {
  const timestamp = toString(attrValue(entity, "TimeInstant"));
  const spacecraft_id = toString(attrValue(entity, "spacecraft_id"));
  if (!timestamp || !spacecraft_id) return null;

  return {
    entity_id: entity.id,
    compartment_id: toString(attrValue(entity, "compartment_id")),
    spacecraft_id,
    name: toString(attrValue(entity, "name")),
    category: toString(attrValue(entity, "category")),
    current_temp: toNumber(attrValue(entity, "current_temp")),
    current_humidity: toNumber(attrValue(entity, "current_humidity")),
    temp_min: toNumber(attrValue(entity, "temp_min")),
    temp_max: toNumber(attrValue(entity, "temp_max")),
    humidity_max: toNumber(attrValue(entity, "humidity_max")),
    is_open: toBoolean(attrValue(entity, "is_open")),
    last_impact_g: toNumber(attrValue(entity, "last_impact_g")),
    last_light_level: toNumber(attrValue(entity, "last_light_level")),
    severity: toString(attrValue(entity, "severity")),
    timestamp,
  };
}
