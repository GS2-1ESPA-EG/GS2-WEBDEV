// Rotas para geração de análises preditivas de consumo de carga via Anthropic
import { Router } from "express";
import { generatePrediction } from "../controllers/prediction.controller.js";

const router = Router();

// POST /api/predictions/generate — dispara análise preditiva para uma nave
router.post("/generate", generatePrediction);

export default router;
