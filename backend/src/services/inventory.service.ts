// Recomputa o estado atual de cada compartimento da nave a partir dos eventos persistidos
import type { CompartmentState, CompartmentStatus, Alert } from "../types/inventory.types.js";
import type { CompartmentReading } from "../types/telemetry.types.js";
import { findEventsBySpacecraft } from "../repositories/event.repository.js";
import { listStatesBySpacecraft, upsertState } from "../repositories/state.repository.js";
import * as AlertService from "./alert.service.js";

export async function getInventoryState(
  spacecraftId: string
): Promise<CompartmentState[]> {
  const existing = listStatesBySpacecraft(spacecraftId);
  if (existing.length > 0) return existing;
  // Sem estado persistido ainda: deriva a partir dos eventos
  return recomputeState(spacecraftId);
}

export async function recomputeState(
  spacecraftId: string
): Promise<CompartmentState[]> {
  const events = findEventsBySpacecraft(spacecraftId); // ordenados por timestamp ASC

  // Última leitura conhecida por compartimento (o ASC garante que o último sobrescreve)
  const latestByCompartment = new Map<string, CompartmentReading>();
  for (const event of events) {
    if (event.event_type !== "compartment_reading") continue;
    const reading = event.payload as unknown as CompartmentReading;
    latestByCompartment.set(reading.compartment_id, reading);
  }

  const now = new Date().toISOString();
  const states: CompartmentState[] = [];

  for (const reading of latestByCompartment.values()) {
    const alerts = AlertService.evaluate(reading);
    const entity_id = `${reading.spacecraft_id}:${reading.compartment_id}`;
    const state: CompartmentState = {
      entity_id,
      spacecraft_id: reading.spacecraft_id,
      compartment_id: reading.compartment_id,
      reading,
      status: worstStatus(alerts),
      alerts,
      last_event_at: reading.timestamp,
      last_recompute_at: now,
    };
    upsertState(entity_id, state);
    states.push(state);
  }

  return states;
}

// Deriva o status geral do compartimento a partir do pior nível de alerta ativo
function worstStatus(alerts: Alert[]): CompartmentStatus {
  if (alerts.some((a) => a.level === "critical")) return "critical";
  if (alerts.some((a) => a.level === "warning")) return "warning";
  return "nominal";
}
