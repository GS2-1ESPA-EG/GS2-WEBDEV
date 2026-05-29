// Agrega naves, compartimentos, itens e estado ao vivo para alimentar o dashboard
import type {
  FleetSummary,
  SpacecraftDetail,
  CompartmentDetail,
} from "../types/fleet.types.js";
import type { CompartmentStatus, Item } from "../types/inventory.types.js";
import {
  listSpacecraft,
  getSpacecraft,
} from "../repositories/spacecraft.repository.js";
import {
  listCompartments,
  countCompartments,
} from "../repositories/compartment.repository.js";
import {
  listItemsBySpacecraft,
  sumQuantityBySpacecraft,
} from "../repositories/item.repository.js";
import * as InventoryService from "./inventory.service.js";

export async function getFleetOverview(): Promise<FleetSummary[]> {
  const ships = listSpacecraft();

  return Promise.all(
    ships.map(async (s) => {
      const states = await InventoryService.getInventoryState(s.spacecraft_id);
      const alerts = states.flatMap((st) => st.alerts);
      return {
        ...s,
        compartment_count: countCompartments(s.spacecraft_id),
        item_count: sumQuantityBySpacecraft(s.spacecraft_id),
        status: worstStatus(states.map((st) => st.status)),
        active_alerts: alerts.length,
        critical_alerts: alerts.filter((a) => a.level === "critical").length,
        warning_alerts: alerts.filter((a) => a.level === "warning").length,
        sensored_compartments: states.length,
        nominal_compartments: states.filter((st) => st.status === "nominal").length,
      };
    })
  );
}

export async function getSpacecraftDetail(
  spacecraftId: string
): Promise<SpacecraftDetail | null> {
  const ship = getSpacecraft(spacecraftId);
  if (!ship) return null;

  const compartments = listCompartments(spacecraftId);
  const states = await InventoryService.getInventoryState(spacecraftId);
  const stateByCompartment = new Map(states.map((st) => [st.compartment_id, st]));

  const items = listItemsBySpacecraft(spacecraftId);
  const itemsByCompartment = new Map<string, Item[]>();
  for (const item of items) {
    const list = itemsByCompartment.get(item.compartment_id) ?? [];
    list.push(item);
    itemsByCompartment.set(item.compartment_id, list);
  }

  const detail: CompartmentDetail[] = compartments.map((c) => {
    const compartmentItems = itemsByCompartment.get(c.compartment_id) ?? [];
    return {
      ...c,
      state: stateByCompartment.get(c.compartment_id) ?? null,
      items: compartmentItems,
      item_count: compartmentItems.reduce((n, it) => n + it.quantity, 0),
    };
  });

  return { ...ship, compartments: detail };
}

function worstStatus(statuses: CompartmentStatus[]): CompartmentStatus {
  if (statuses.includes("critical")) return "critical";
  if (statuses.includes("warning")) return "warning";
  return "nominal";
}
