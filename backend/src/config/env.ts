// Valida variáveis de ambiente obrigatórias com Zod e exporta objeto tipado
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DB_PATH: z.string().default("./data/orbitstock.db"),
  ANTHROPIC_API_KEY: z.string().min(1, "ANTHROPIC_API_KEY é obrigatória"),
  ORION_URL: z.string().url().default("http://localhost:1026"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Variáveis de ambiente inválidas:", parsed.error.flatten());
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
