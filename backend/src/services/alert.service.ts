// Avalia limiares de estoque no estado do inventário e emite alertas por item
import type { Alert, EntityState } from "../types/inventory.types.js";

export function evaluate(state: EntityState): Alert[] {
  // TODO: percorrer state.items e calcular percentual restante por categoria
  // TODO: emitir alerta "warning" para itens com <= 20% da quantidade nominal
  // TODO: emitir alerta "critical" para itens com <= 10% da quantidade nominal
  // TODO: retornar lista de alertas com alert_id único (crypto.randomUUID)
  void state;
  return [];
}

export async function getActiveAlerts(spacecraftId: string): Promise<Alert[]> {
  // TODO: chamar InventoryService.getInventoryState(spacecraftId)
  // TODO: se estado existir, chamar evaluate(state) e retornar alertas
  void spacecraftId;
  return [];
}
