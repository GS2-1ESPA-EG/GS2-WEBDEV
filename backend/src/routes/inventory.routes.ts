// Rotas para consulta do inventário atual e alertas ativos por nave
import { Router } from "express";
import {
  getInventory,
  listAlerts,
} from "../controllers/inventory.controller.js";

const router = Router();

// GET /api/inventory/:spacecraftId — estado atual do inventário
router.get("/:spacecraftId", getInventory);

// GET /api/inventory/:spacecraftId/alerts — alertas de limiar ativos
router.get("/:spacecraftId/alerts", listAlerts);

export default router;
