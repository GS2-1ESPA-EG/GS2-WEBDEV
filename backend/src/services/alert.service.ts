// Avalia limiares de sensores numa leitura de compartimento e emite alertas tipados
import { randomUUID } from "node:crypto";
import type { Alert } from "../types/inventory.types.js";
import type { CompartmentReading } from "../types/telemetry.types.js";
import { listStatesBySpacecraft } from "../repositories/state.repository.js";

// Margem (10%) usada para emitir "warning" quando o valor se aproxima do limite
const MARGIN = 0.1;
// Limiares de impacto em G (a VM não envia limite próprio, então definimos aqui)
const IMPACT_WARNING_G = 3;
const IMPACT_CRITICAL_G = 5;

export function evaluate(reading: CompartmentReading): Alert[] {
  const alerts: Alert[] = [];

  // Temperatura: fora da faixa [temp_min, temp_max] é crítico; perto do limite é warning
  if (reading.current_temp < reading.temp_min || reading.current_temp > reading.temp_max) {
    alerts.push(
      mk(reading, "temperature", "critical",
        `Temperatura ${reading.current_temp}°C fora da faixa nominal [${reading.temp_min}, ${reading.temp_max}]°C`)
    );
  } else {
    const margin = (reading.temp_max - reading.temp_min) * MARGIN;
    if (
      reading.current_temp <= reading.temp_min + margin ||
      reading.current_temp >= reading.temp_max - margin
    ) {
      alerts.push(
        mk(reading, "temperature", "warning",
          `Temperatura ${reading.current_temp}°C próxima do limite [${reading.temp_min}, ${reading.temp_max}]°C`)
      );
    }
  }

  // Umidade: acima do máximo é crítico; perto do máximo é warning
  if (reading.current_humidity > reading.humidity_max) {
    alerts.push(
      mk(reading, "humidity", "critical",
        `Umidade ${reading.current_humidity}% acima do máximo ${reading.humidity_max}%`)
    );
  } else if (reading.current_humidity >= reading.humidity_max * (1 - MARGIN)) {
    alerts.push(
      mk(reading, "humidity", "warning",
        `Umidade ${reading.current_humidity}% próxima do máximo ${reading.humidity_max}%`)
    );
  }

  // Porta aberta
  if (reading.is_open) {
    alerts.push(
      mk(reading, "door", "warning", `Compartimento ${reading.compartment_id} está aberto`)
    );
  }

  // Impacto
  if (reading.last_impact_g >= IMPACT_CRITICAL_G) {
    alerts.push(
      mk(reading, "impact", "critical", `Impacto de ${reading.last_impact_g}G detectado`)
    );
  } else if (reading.last_impact_g >= IMPACT_WARNING_G) {
    alerts.push(
      mk(reading, "impact", "warning", `Impacto de ${reading.last_impact_g}G detectado`)
    );
  }

  return alerts;
}

export async function getActiveAlerts(spacecraftId: string): Promise<Alert[]> {
  // Lê os alertas já calculados e persistidos no estado de cada compartimento
  const states = listStatesBySpacecraft(spacecraftId);
  return states.flatMap((s) => s.alerts);
}

function mk(
  reading: CompartmentReading,
  type: Alert["type"],
  level: Alert["level"],
  message: string
): Alert {
  return {
    alert_id: randomUUID(),
    spacecraft_id: reading.spacecraft_id,
    compartment_id: reading.compartment_id,
    type,
    level,
    message,
    triggered_at: reading.timestamp,
  };
}
