// Rotas para ingestão de notificações do FIWARE Orion e consulta de eventos
import { Router } from "express";
import {
  receiveNotification,
  listEvents,
} from "../controllers/telemetry.controller.js";

const router = Router();

// POST /api/telemetry/notify — callback registrado no Orion Context Broker
router.post("/notify", receiveNotification);

// GET /api/telemetry/events/:spacecraftId?since=<ISO> — lista eventos de uma nave
router.get("/events/:spacecraftId", listEvents);

export default router;
