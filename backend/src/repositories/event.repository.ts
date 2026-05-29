// Operações CRUD na tabela events com idempotência via ON CONFLICT DO NOTHING
import type { Event } from "../types/telemetry.types.js";
import { getDb } from "./db.js";

export function insertEvent(event: Event): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO events
      (event_id, event_type, source, spacecraft_id, timestamp, received_at, envelope_id, payload)
    VALUES
      (@event_id, @event_type, @source, @spacecraft_id, @timestamp, @received_at, @envelope_id, @payload)
    ON CONFLICT(event_id) DO NOTHING
  `).run({
    event_id: event.event_id,
    event_type: event.event_type,
    source: event.source,
    spacecraft_id: event.spacecraft_id,
    timestamp: event.timestamp,
    received_at: event.received_at,
    envelope_id: event.envelope_id ?? null,
    payload: JSON.stringify(event.payload),
  });
}

export function findEventsBySpacecraft(
  spacecraftId: string,
  sinceTimestamp?: string
): Event[] {
  const db = getDb();
  const rows = sinceTimestamp
    ? (db
        .prepare(
          "SELECT * FROM events WHERE spacecraft_id = ? AND timestamp >= ? ORDER BY timestamp ASC"
        )
        .all(spacecraftId, sinceTimestamp) as unknown as RawEventRow[])
    : (db
        .prepare(
          "SELECT * FROM events WHERE spacecraft_id = ? ORDER BY timestamp ASC"
        )
        .all(spacecraftId) as unknown as RawEventRow[]);

  return rows.map(deserializeEvent);
}

export function findEventsByType(type: string): Event[] {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM events WHERE event_type = ? ORDER BY timestamp ASC"
    )
    .all(type) as unknown as RawEventRow[];
  return rows.map(deserializeEvent);
}

interface RawEventRow {
  event_id: string;
  event_type: string;
  source: string;
  spacecraft_id: string;
  timestamp: string;
  received_at: string;
  envelope_id: string | null;
  payload: string;
}

function deserializeEvent(row: RawEventRow): Event {
  return {
    event_id: row.event_id,
    event_type: row.event_type,
    source: row.source,
    spacecraft_id: row.spacecraft_id,
    timestamp: row.timestamp,
    received_at: row.received_at,
    envelope_id: row.envelope_id ?? undefined,
    payload: JSON.parse(row.payload) as Record<string, unknown>,
  };
}
