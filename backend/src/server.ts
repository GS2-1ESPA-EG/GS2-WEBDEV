// Ponto de entrada da aplicação: configura Express, middlewares globais e inicia o servidor
import "dotenv/config";
import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api", router);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`OrbitStock backend rodando em http://localhost:${env.PORT}`);
});
