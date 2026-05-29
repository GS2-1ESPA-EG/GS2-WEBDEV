// Faz polling no Orion Context Broker e dispara processamento de telemetria
import { env } from "../config/env.js";
import * as TelemetryService from "./telemetry.service.js";
import type { OrionEntity } from "../types/telemetry.types.js";

const ENTITIES_TO_POLL = [
  "urn:ngsi-ld:Compartment:DRAGON-C209:M-03",
];

const POLL_INTERVAL_MS = 3000;
const FIWARE_SERVICE = "smart";
const FIWARE_SERVICEPATH = "/";

let intervalHandle: NodeJS.Timeout | null = null;
let lastSeenTimestamps = new Map<string, string>();

async function fetchEntity(entityId: string): Promise<OrionEntity | null> {
  const url = `${env.ORION_URL}/v2/entities/${encodeURIComponent(entityId)}`;
  try {
    const response = await fetch(url, {
      headers: {
        "fiware-service": FIWARE_SERVICE,
        "fiware-servicepath": FIWARE_SERVICEPATH,
      },
    });
    if (!response.ok) {
      console.warn(`[Orion Poller] ${entityId} retornou ${response.status}`);
      return null;
    }
    return (await response.json()) as OrionEntity;
  } catch (err) {
    console.error(`[Orion Poller] Erro ao buscar ${entityId}:`, err);
    return null;
  }
}

function extractTimeInstant(entity: OrionEntity): string | null {
  const ti = entity.TimeInstant;
  if (typeof ti === "object" && ti !== null && "value" in ti) {
    return String((ti as { value: unknown }).value);
  }
  return null;
}

async function pollCycle(): Promise<void> {
  for (const entityId of ENTITIES_TO_POLL) {
    const entity = await fetchEntity(entityId);
    if (!entity) continue;

    const timeInstant = extractTimeInstant(entity);
    if (!timeInstant) continue;

    const lastSeen = lastSeenTimestamps.get(entityId);
    if (lastSeen === timeInstant) continue; // sem novidade

    lastSeenTimestamps.set(entityId, timeInstant);

    // Entrega ao service de telemetria como se fosse uma notificação
    await TelemetryService.processNotification({
      subscriptionId: "polling-local",
      data: [entity],
    });

    console.log(
      `[Orion Poller] ${entityId} atualizado em ${timeInstant}`
    );
  }
}

export function startPolling(): void {
  if (intervalHandle) return;
  console.log(
    `[Orion Poller] Iniciando polling a cada ${POLL_INTERVAL_MS}ms em ${env.ORION_URL}`
  );
  intervalHandle = setInterval(() => {
    void pollCycle();
  }, POLL_INTERVAL_MS);
  // primeira chamada imediata
  void pollCycle();
}

export function stopPolling(): void {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
}
