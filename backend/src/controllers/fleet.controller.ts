// Endpoints da frota: visão geral (cards/KPIs) e detalhe de uma nave
import type { Request, Response, NextFunction } from "express";
import * as FleetService from "../services/fleet.service.js";

export async function getFleet(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const fleet = await FleetService.getFleetOverview();
    res.json({ fleet });
  } catch (err) {
    next(err);
  }
}

export async function getSpacecraft(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { spacecraftId } = req.params as { spacecraftId: string };
    const detail = await FleetService.getSpacecraftDetail(spacecraftId);
    if (!detail) {
      res.status(404).json({ error: `Nave ${spacecraftId} não encontrada` });
      return;
    }
    res.json(detail);
  } catch (err) {
    next(err);
  }
}
