// Operações de upsert e leitura na tabela current_state do inventário
import type { EntityState } from "../types/inventory.types.js";
import { getDb } from "./db.js";

export function upsertState(entityId: string, state: EntityState): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO current_state (entity_id, state, last_event_at, last_recompute_at)
    VALUES (@entity_id, @state, @last_event_at, @last_recompute_at)
    ON CONFLICT(entity_id) DO UPDATE SET
      state             = excluded.state,
      last_event_at     = excluded.last_event_at,
      last_recompute_at = excluded.last_recompute_at
  `).run({
    entity_id: entityId,
    state: JSON.stringify(state),
    last_event_at: state.last_event_at,
    last_recompute_at: state.last_recompute_at,
  });
}

export function getState(entityId: string): EntityState | null {
  const db = getDb();
  const row = db
    .prepare("SELECT state FROM current_state WHERE entity_id = ?")
    .get(entityId) as unknown as { state: string } | undefined;

  if (!row) return null;
  return JSON.parse(row.state) as EntityState;
}

export function listStatesBySpacecraft(spacecraftId: string): EntityState[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT state FROM current_state WHERE entity_id LIKE ?")
    .all(`${spacecraftId}:%`) as unknown as Array<{ state: string }>;

  return rows.map((r) => JSON.parse(r.state) as EntityState);
}
