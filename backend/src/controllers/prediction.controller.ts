// Valida requisição de previsão, dispara PredictionService e retorna relatório
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as PredictionService from "../services/prediction.service.js";

const generateBodySchema = z.object({
  spacecraft_id: z.string().min(1),
  horizon_days: z.number().int().min(1).max(365).default(30),
  items: z.array(z.string()).optional(),
});

export async function generatePrediction(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = generateBodySchema.parse(req.body);
    // TODO: const report = await PredictionService.generate(body)
    // TODO: retornar report completo com status 200
    void PredictionService;
    res
      .status(202)
      .json({ message: "Análise iniciada", spacecraft_id: body.spacecraft_id });
  } catch (err) {
    next(err);
  }
}
