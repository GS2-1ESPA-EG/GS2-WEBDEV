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

    CREATE TABLE IF NOT EXISTS spacecraft (
      spacecraft_id TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      mission       TEXT NOT NULL,
      crew_count    INTEGER NOT NULL,
      active        INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS compartments (
      spacecraft_id  TEXT NOT NULL,
      compartment_id TEXT NOT NULL,
      name           TEXT NOT NULL,
      category       TEXT NOT NULL,
      temp_min       REAL NOT NULL,
      temp_max       REAL NOT NULL,
      humidity_max   REAL NOT NULL,
      has_sensor     INTEGER NOT NULL,
      PRIMARY KEY (spacecraft_id, compartment_id)
    );

    CREATE TABLE IF NOT EXISTS items (
      item_id        TEXT PRIMARY KEY,
      spacecraft_id  TEXT NOT NULL,
      compartment_id TEXT NOT NULL,
      name           TEXT NOT NULL,
      category       TEXT NOT NULL,
      quantity       INTEGER NOT NULL,
      capacity       INTEGER NOT NULL,
      unit           TEXT NOT NULL,
      mass_kg        REAL NOT NULL,
      code           TEXT NOT NULL,
      expiry         TEXT NOT NULL,
      status         TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_events_spacecraft ON events (spacecraft_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_events_type       ON events (event_type);
    CREATE INDEX IF NOT EXISTS idx_compartments_sc   ON compartments (spacecraft_id);
    CREATE INDEX IF NOT EXISTS idx_items_sc          ON items (spacecraft_id);
    CREATE INDEX IF NOT EXISTS idx_items_compartment ON items (spacecraft_id, compartment_id);
  `);

  return instance;
}
