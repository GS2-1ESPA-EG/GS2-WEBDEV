// Baixa de itens: decrementa a quantidade e registra um evento de consumo (histórico)
import { randomUUID } from "node:crypto";
import type { Item, ItemStatus } from "../types/inventory.types.js";
import type { Event } from "../types/telemetry.types.js";
import { getItem, upsertItem, listItemsBySpacecraft } from "../repositories/item.repository.js";
import { insertEvent } from "../repositories/event.repository.js";

// Recalcula o status do item a partir do percentual restante
function statusFor(quantity: number, capacity: number): ItemStatus {
  if (quantity <= 0) return "critical";
  const pct = capacity > 0 ? quantity / capacity : 1;
  if (pct < 0.15) return "critical";
  if (pct < 0.35) return "low";
  return "nominal";
}

export async function consume(itemId: string, amount: number): Promise<Item> {
  const item = getItem(itemId);
  if (!item) {
    const err = new Error(`Item ${itemId} não encontrado`) as Error & { status?: number };
    err.status = 404;
    throw err;
  }
  if (amount <= 0) {
    const err = new Error("amount deve ser positivo") as Error & { status?: number };
    err.status = 400;
    throw err;
  }

  const newQuantity = Math.max(0, item.quantity - amount);
  const updated: Item = {
    ...item,
    quantity: newQuantity,
    status: statusFor(newQuantity, item.capacity),
  };
  upsertItem(updated);

  // Registra o consumo como evento (alimenta a série temporal para a previsão)
  const now = new Date().toISOString();
  const event: Event = {
    event_id: randomUUID(),
    event_type: "consumption",
    source: "astronaut-app",
    spacecraft_id: item.spacecraft_id,
    timestamp: now,
    received_at: now,
    payload: {
      item_id: item.item_id,
      compartment_id: item.compartment_id,
      name: item.name,
      unit: item.unit,
      amount,
      quantity_after: newQuantity,
      capacity: item.capacity,
    },
  };
  insertEvent(event);

  return updated;
}

export async function listItems(spacecraftId: string): Promise<Item[]> {
  return listItemsBySpacecraft(spacecraftId);
}
