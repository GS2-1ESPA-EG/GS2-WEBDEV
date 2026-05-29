// Operações de leitura/escrita na tabela spacecraft (metadados das naves Dragon)
import type { Spacecraft } from "../types/fleet.types.js";
import { getDb } from "./db.js";

interface RawSpacecraftRow {
  spacecraft_id: string;
  name: string;
  mission: string;
  crew_count: number;
  active: number;
}

function deserialize(row: RawSpacecraftRow): Spacecraft {
  return {
    spacecraft_id: row.spacecraft_id,
    name: row.name,
    mission: row.mission,
    crew_count: row.crew_count,
    active: row.active === 1,
  };
}

export function upsertSpacecraft(s: Spacecraft): void {
  getDb().prepare(`
    INSERT INTO spacecraft (spacecraft_id, name, mission, crew_count, active)
    VALUES (@spacecraft_id, @name, @mission, @crew_count, @active)
    ON CONFLICT(spacecraft_id) DO UPDATE SET
      name = excluded.name,
      mission = excluded.mission,
      crew_count = excluded.crew_count,
      active = excluded.active
  `).run({
    spacecraft_id: s.spacecraft_id,
    name: s.name,
    mission: s.mission,
    crew_count: s.crew_count,
    active: s.active ? 1 : 0,
  });
}

export function listSpacecraft(): Spacecraft[] {
  const rows = getDb()
    .prepare("SELECT * FROM spacecraft ORDER BY spacecraft_id ASC")
    .all() as unknown as RawSpacecraftRow[];
  return rows.map(deserialize);
}

export function getSpacecraft(spacecraftId: string): Spacecraft | null {
  const row = getDb()
    .prepare("SELECT * FROM spacecraft WHERE spacecraft_id = ?")
    .get(spacecraftId) as unknown as RawSpacecraftRow | undefined;
  return row ? deserialize(row) : null;
}
