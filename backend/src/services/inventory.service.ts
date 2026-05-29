// Mantém e recomputa o estado atual do inventário a partir dos eventos persistidos
import type { EntityState } from "../types/inventory.types.js";

export async function getInventoryState(
  spacecraftId: string
): Promise<EntityState | null> {
  // TODO: chamar state.repository.getState(spacecraftId)
  // TODO: se não existir estado, chamar recomputeState e persistir antes de retornar
  void spacecraftId;
  return null;
}

export async function recomputeState(spacecraftId: string): Promise<EntityState> {
  // TODO: buscar todos os eventos da nave com findEventsBySpacecraft
  // TODO: agregar eventos em ordem cronológica para derivar o estado atual dos itens
  // TODO: chamar upsertState com o estado recalculado
  // TODO: chamar AlertService.evaluate(state) para checar limiares e emitir alertas
  void spacecraftId;
  return {} as EntityState;
}
