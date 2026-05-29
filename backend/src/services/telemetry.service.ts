// Processa notificações do Orion: mapeia entidades para eventos e persiste no banco
import type { TelemetryPayload } from "../types/telemetry.types.js";
import type { Event } from "../types/telemetry.types.js";

export async function processNotification(payload: TelemetryPayload): Promise<void> {
  // TODO: iterar sobre payload.data e mapear cada OrionEntity para um Event tipado
  // TODO: chamar insertEvent(event) para cada evento (idempotente via ON CONFLICT DO NOTHING)
  // TODO: coletar spacecraft_ids únicos afetados
  // TODO: para cada spacecraft_id, chamar InventoryService.recomputeState(id)
  void payload;
}

export async function getEvents(
  spacecraftId: string,
  sinceTimestamp?: string
): Promise<Event[]> {
  // TODO: chamar findEventsBySpacecraft(spacecraftId, sinceTimestamp)
  // TODO: retornar lista tipada de eventos
  void spacecraftId;
  void sinceTimestamp;
  return [];
}
