// Operações CRUD na tabela items (carga estivada em cada compartimento)
import type { Item } from "../types/inventory.types.js";
import { getDb } from "./db.js";

interface RawItemRow {
  item_id: string;
  spacecraft_id: string;
  compartment_id: string;
  name: string;
  category: string;
  quantity: number;
  capacity: number;
  unit: string;
  mass_kg: number;
  code: string;
  expiry: string;
  status: string;
}

function deserialize(row: RawItemRow): Item {
  return {
    item_id: row.item_id,
    spacecraft_id: row.spacecraft_id,
    compartment_id: row.compartment_id,
    name: row.name,
    category: row.category,
    quantity: row.quantity,
    capacity: row.capacity,
    unit: row.unit,
    mass_kg: row.mass_kg,
    code: row.code,
    expiry: row.expiry,
    status: row.status as Item["status"],
  };
}

export function upsertItem(item: Item): void {
  getDb().prepare(`
    INSERT INTO items
      (item_id, spacecraft_id, compartment_id, name, category, quantity, capacity, unit, mass_kg, code, expiry, status)
    VALUES
      (@item_id, @spacecraft_id, @compartment_id, @name, @category, @quantity, @capacity, @unit, @mass_kg, @code, @expiry, @status)
    ON CONFLICT(item_id) DO UPDATE SET
      spacecraft_id = excluded.spacecraft_id,
      compartment_id = excluded.compartment_id,
      name = excluded.name,
      category = excluded.category,
      quantity = excluded.quantity,
      capacity = excluded.capacity,
      unit = excluded.unit,
      mass_kg = excluded.mass_kg,
      code = excluded.code,
      expiry = excluded.expiry,
      status = excluded.status
  `).run({ ...item });
}

export function listItemsBySpacecraft(spacecraftId: string): Item[] {
  const rows = getDb()
    .prepare("SELECT * FROM items WHERE spacecraft_id = ? ORDER BY compartment_id, name")
    .all(spacecraftId) as unknown as RawItemRow[];
  return rows.map(deserialize);
}

export function listItemsByCompartment(
  spacecraftId: string,
  compartmentId: string
): Item[] {
  const rows = getDb()
    .prepare(
      "SELECT * FROM items WHERE spacecraft_id = ? AND compartment_id = ? ORDER BY name"
    )
    .all(spacecraftId, compartmentId) as unknown as RawItemRow[];
  return rows.map(deserialize);
}

export function getItem(itemId: string): Item | null {
  const row = getDb()
    .prepare("SELECT * FROM items WHERE item_id = ?")
    .get(itemId) as unknown as RawItemRow | undefined;
  return row ? deserialize(row) : null;
}

// Soma das quantidades de itens de uma nave (KPI "itens monitorados")
export function sumQuantityBySpacecraft(spacecraftId: string): number {
  const row = getDb()
    .prepare("SELECT COALESCE(SUM(quantity), 0) AS total FROM items WHERE spacecraft_id = ?")
    .get(spacecraftId) as unknown as { total: number };
  return row.total;
}
