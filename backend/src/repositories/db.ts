// Singleton de conexão SQLite: cria tabelas e índices na primeira inicialização
import { DatabaseSync } from "node:sqlite";
import { env } from "../config/env.js";

let instance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (instance) return instance;

  instance = new DatabaseSync(env.DB_PATH);
  instance.exec("PRAGMA journal_mode = WAL");

  instance.exec(`
    CREATE TABLE IF NOT EXISTS events (
      event_id      TEXT PRIMARY KEY,
      event_type    TEXT NOT NULL,
      source        TEXT NOT NULL,
      spacecraft_id TEXT NOT NULL,
      timestamp     TEXT NOT NULL,
      received_at   TEXT NOT NULL,
      envelope_id   TEXT,
      payload       TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS current_state (
      entity_id         TEXT PRIMARY KEY,
      state             TEXT NOT NULL,
      last_event_at     TEXT NOT NULL,
      last_recompute_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_events_spacecraft ON events (spacecraft_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_events_type       ON events (event_type);
  `);

  return instance;
}
