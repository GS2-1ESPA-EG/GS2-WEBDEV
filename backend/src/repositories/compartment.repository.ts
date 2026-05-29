// Operações na tabela compartments (registro estático de compartimentos por nave)
import type { Compartment } from "../types/fleet.types.js";
import { getDb } from "./db.js";

interface RawCompartmentRow {
  spacecraft_id: string;
  compartment_id: string;
  name: string;
  category: string;
  temp_min: number;
  temp_max: number;
  humidity_max: number;
  has_sensor: number;
}

function deserialize(row: RawCompartmentRow): Compartment {
  return {
    spacecraft_id: row.spacecraft_id,
    compartment_id: row.compartment_id,
    name: row.name,
    category: row.category,
    temp_min: row.temp_min,
    temp_max: row.temp_max,
    humidity_max: row.humidity_max,
    has_sensor: row.has_sensor === 1,
  };
}

export function upsertCompartment(c: Compartment): void {
  getDb().prepare(`
    INSERT INTO compartments
      (spacecraft_id, compartment_id, name, category, temp_min, temp_max, humidity_max, has_sensor)
    VALUES
      (@spacecraft_id, @compartment_id, @name, @category, @temp_min, @temp_max, @humidity_max, @has_sensor)
    ON CONFLICT(spacecraft_id, compartment_id) DO UPDATE SET
      name = excluded.name,
      category = excluded.category,
      temp_min = excluded.temp_min,
      temp_max = excluded.temp_max,
      humidity_max = excluded.humidity_max,
      has_sensor = excluded.has_sensor
  `).run({
    spacecraft_id: c.spacecraft_id,
    compartment_id: c.compartment_id,
    name: c.name,
    category: c.category,
    temp_min: c.temp_min,
    temp_max: c.temp_max,
    humidity_max: c.humidity_max,
    has_sensor: c.has_sensor ? 1 : 0,
  });
}

export function listCompartments(spacecraftId: string): Compartment[] {
  const rows = getDb()
    .prepare("SELECT * FROM compartments WHERE spacecraft_id = ? ORDER BY compartment_id ASC")
    .all(spacecraftId) as unknown as RawCompartmentRow[];
  return rows.map(deserialize);
}

export function countCompartments(spacecraftId: string): number {
  const row = getDb()
    .prepare("SELECT COUNT(*) AS n FROM compartments WHERE spacecraft_id = ?")
    .get(spacecraftId) as unknown as { n: number };
  return row.n;
}
