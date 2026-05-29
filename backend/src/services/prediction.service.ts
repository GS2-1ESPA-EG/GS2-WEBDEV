// Gera análises preditivas de consumo de carga usando o Anthropic SDK
import type { PredictionRequest, PredictionReport } from "../types/prediction.types.js";
import { anthropic } from "../config/anthropic.js";

export async function generate(
  request: PredictionRequest
): Promise<PredictionReport> {
  // TODO: buscar estado atual do inventário via InventoryService.getInventoryState
  // TODO: buscar histórico de eventos dos últimos N dias via TelemetryService.getEvents
  // TODO: montar system prompt com contexto da missão Dragon/SpaceX
  // TODO: montar user prompt com: estado atual dos itens, histórico de consumo e horizon_days
  // TODO: usar cache_control: { type: "ephemeral" } no system prompt para prompt caching
  // TODO: chamar anthropic.messages.create com modelo claude-haiku-4-5-20251001
  // TODO: parsear a resposta e construir PredictionReport com predictions e recommendations
  void anthropic;
  void request;
  return {} as PredictionReport;
}
