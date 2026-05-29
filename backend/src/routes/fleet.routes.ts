// Rotas da frota: visão geral e detalhe de uma nave
import { Router } from "express";
import { getFleet, getSpacecraft } from "../controllers/fleet.controller.js";

const router = Router();

// GET /api/fleet — resumo de todas as naves (cards + KPIs)
router.get("/", getFleet);

// GET /api/fleet/:spacecraftId — detalhe: compartimentos + estado ao vivo + itens
router.get("/:spacecraftId", getSpacecraft);

export default router;
