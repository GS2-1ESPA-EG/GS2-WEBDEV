// Tipos da frota: naves, registro de compartimentos e agregados para o dashboard
import type { CompartmentStatus } from "./inventory.types.js";
import type { CompartmentState } from "./inventory.types.js";
import type { Item } from "./inventory.types.js";

// Metadados de uma nave Dragon (gerenciados no SQLite)
export interface Spacecraft {
  spacecraft_id: string; // DRAGON-C209
  name: string;          // "Dragon C209"
  mission: string;       // "CRS-31 · ISS rendezvous"
  crew_count: number;
  active: boolean;
}

// Definição estática de um compartimento (registro), independente da telemetria ao vivo.
// A telemetria atualiza a leitura; este registro define nome, categoria e limites nominais.
export interface Compartment {
  spacecraft_id: string;
  compartment_id: string;
  name: string;
  category: string;
  temp_min: number;
  temp_max: number;
  humidity_max: number;
  has_sensor: boolean; // true quando há ESP32 publicando telemetria deste compartimento
}

// Resumo de uma nave para os cards da "Visão geral da frota"
export interface FleetSummary {
  spacecraft_id: string;
  name: string;
  mission: string;
  crew_count: number;
  active: boolean;
  compartment_count: number;
  item_count: number;          // soma das quantidades dos itens
  status: CompartmentStatus;   // pior status entre os compartimentos com sensor
  active_alerts: number;
  critical_alerts: number;
  warning_alerts: number;
  sensored_compartments: number;   // compartimentos com telemetria ao vivo
  nominal_compartments: number;    // dos sensored, quantos estão nominais
}

// Detalhe completo de uma nave: compartimentos (def + estado ao vivo + itens)
export interface CompartmentDetail extends Compartment {
  state: CompartmentState | null; // estado/telemetria ao vivo (null se sem sensor ou sem leitura)
  items: Item[];
  item_count: number;
}

export interface SpacecraftDetail extends Spacecraft {
  compartments: CompartmentDetail[];
}
