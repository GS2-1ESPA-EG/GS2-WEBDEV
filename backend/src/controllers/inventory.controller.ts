// Consulta estado do inventário e alertas ativos de uma nave via InventoryService
import type { Request, Response, NextFunction } from "express";
import * as InventoryService from "../services/inventory.service.js";
import * as AlertService from "../services/alert.service.js";

export async function getInventory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { spacecraftId } = req.params as { spacecraftId: string };
    const compartments = await InventoryService.getInventoryState(spacecraftId);
    res.json({ spacecraft_id: spacecraftId, compartments });
  } catch (err) {
    next(err);
  }
}

export async function listAlerts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { spacecraftId } = req.params as { spacecraftId: string };
    // Garante que o estado (e seus alertas) esteja calculado antes de ler
    await InventoryService.getInventoryState(spacecraftId);
    const alerts = await AlertService.getActiveAlerts(spacecraftId);
    res.json({ spacecraft_id: spacecraftId, alerts });
  } catch (err) {
    next(err);
  }
}
