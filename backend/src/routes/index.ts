// Agrega todas as rotas da API e as monta sob /api com seus prefixos
import { Router } from "express";
import telemetryRouter from "./telemetry.routes.js";
import inventoryRouter from "./inventory.routes.js";
import predictionRouter from "./prediction.routes.js";

const router = Router();

router.use("/telemetry", telemetryRouter);
router.use("/inventory", inventoryRouter);
router.use("/predictions", predictionRouter);

export default router;
