// Valida requisição de previsão, dispara PredictionService e retorna relatório
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as PredictionService from "../services/prediction.service.js";

const generateBodySchema = z.object({
  spacecraft_id: z.string().min(1),
  horizon_hours: z.number().int().min(1).max(168).default(12),
});

export async function generatePrediction(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = generateBodySchema.parse(req.body);
    const report = await PredictionService.generate(body);
    res.json(report);
  } catch (err) {
    next(err);
  }
}
