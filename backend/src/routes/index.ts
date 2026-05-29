// Agrega todas as rotas da API e as monta sob /api com seus prefixos
import { Router } from "express";
import telemetryRouter from "./telemetry.routes.js";
import inventoryRouter from "./inventory.routes.js";
import predictionRouter from "./prediction.routes.js";
import fleetRouter from "./fleet.routes.js";
import itemRouter from "./item.routes.js";

const router = Router();

router.use("/telemetry", telemetryRouter);
router.use("/inventory", inventoryRouter);
router.use("/predictions", predictionRouter);
router.use("/fleet", fleetRouter);
router.use("/items", itemRouter);

export default router;
