// Cliente HTTP simples para a API do backend OrbitStock
import type {
  FleetSummary,
  SpacecraftDetail,
  TelemetryEvent,
  PredictionReport,
  Item,
} from "./types";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000/api";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`GET ${path} falhou: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function fetchFleet(): Promise<FleetSummary[]> {
  const data = await getJson<{ fleet: FleetSummary[] }>("/fleet");
  return data.fleet;
}

export async function fetchSpacecraft(
  spacecraftId: string
): Promise<SpacecraftDetail> {
  return getJson<SpacecraftDetail>(`/fleet/${encodeURIComponent(spacecraftId)}`);
}

export async function fetchEvents(
  spacecraftId: string,
  since?: string
): Promise<TelemetryEvent[]> {
  const qs = since ? `?since=${encodeURIComponent(since)}` : "";
  const data = await getJson<{ events: TelemetryEvent[] }>(
    `/telemetry/events/${encodeURIComponent(spacecraftId)}${qs}`
  );
  return data.events;
}

export async function consumeItem(itemId: string, amount = 1): Promise<Item> {
  const res = await fetch(`${BASE_URL}/items/${encodeURIComponent(itemId)}/consume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) {
    throw new Error(`Baixa do item falhou: ${res.status}`);
  }
  return (await res.json()) as Item;
}

export async function generatePrediction(
  spacecraftId: string,
  horizonHours = 12
): Promise<PredictionReport> {
  const res = await fetch(`${BASE_URL}/predictions/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spacecraft_id: spacecraftId, horizon_hours: horizonHours }),
  });
  if (!res.ok) {
    throw new Error(`POST /predictions/generate falhou: ${res.status}`);
  }
  return (await res.json()) as PredictionReport;
}
