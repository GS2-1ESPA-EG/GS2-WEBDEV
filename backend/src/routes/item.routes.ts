// Rotas de itens de carga: baixa (consumo) e listagem
import { Router } from "express";
import { consumeItem, listItems } from "../controllers/item.controller.js";

const router = Router();

// POST /api/items/:itemId/consume — dá baixa em N unidades de um item
router.post("/:itemId/consume", consumeItem);

// GET /api/items/:spacecraftId — lista itens de uma nave
router.get("/:spacecraftId", listItems);

export default router;
