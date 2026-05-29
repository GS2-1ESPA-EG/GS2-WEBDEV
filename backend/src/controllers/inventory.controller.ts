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
    // TODO: const state = await InventoryService.getInventoryState(spacecraftId)
    // TODO: se state for null, retornar 404
    void InventoryService;
    res.json({ spacecraft_id: spacecraftId, items: [] });
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
    // TODO: const alerts = await AlertService.getActiveAlerts(spacecraftId)
    void AlertService;
    res.json({ spacecraft_id: spacecraftId, alerts: [] });
  } catch (err) {
    next(err);
  }
}
