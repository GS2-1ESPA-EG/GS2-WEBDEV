// Seed idempotente: popula naves, compartimentos e itens de carga no SQLite.
// Rode com `npm run seed`. M-03 é mantido consistente com a telemetria da VM.
import "dotenv/config";
import { upsertSpacecraft } from "./repositories/spacecraft.repository.js";
import { upsertCompartment } from "./repositories/compartment.repository.js";
import { upsertItem } from "./repositories/item.repository.js";
import type { Spacecraft, Compartment } from "./types/fleet.types.js";
import type { Item, ItemStatus } from "./types/inventory.types.js";

const SPACECRAFT_ID = "DRAGON-C209";

const spacecraft: Spacecraft = {
  spacecraft_id: SPACECRAFT_ID,
  name: "Dragon C209",
  mission: "CRS-31 · ISS rendezvous",
  crew_count: 4,
  active: true,
};

// Registro de compartimentos. M-03 reflete os limites publicados pela VM (2–8°C, hum 80).
const compartments: Compartment[] = [
  { compartment_id: "M-03", name: "Médico refrigerado", category: "medical", temp_min: 2, temp_max: 8, humidity_max: 80, has_sensor: true },
  { compartment_id: "M-01", name: "Farmácia de bordo", category: "medical", temp_min: 15, temp_max: 25, humidity_max: 60, has_sensor: false },
  { compartment_id: "B-04", name: "Alimentos refrigerados", category: "food", temp_min: 0, temp_max: 6, humidity_max: 85, has_sensor: false },
  { compartment_id: "B-02", name: "Alimentos secos", category: "food", temp_min: 10, temp_max: 25, humidity_max: 70, has_sensor: false },
  { compartment_id: "A-01", name: "Água potável", category: "water", temp_min: 5, temp_max: 30, humidity_max: 100, has_sensor: false },
  { compartment_id: "S-01", name: "Experimentos científicos", category: "science", temp_min: 18, temp_max: 24, humidity_max: 55, has_sensor: false },
  { compartment_id: "S-02", name: "Amostras criogênicas", category: "science", temp_min: -20, temp_max: -5, humidity_max: 40, has_sensor: false },
  { compartment_id: "E-01", name: "Equipamentos EVA", category: "equipment", temp_min: 0, temp_max: 40, humidity_max: 70, has_sensor: false },
  { compartment_id: "E-02", name: "Ferramentas", category: "tools", temp_min: 0, temp_max: 40, humidity_max: 70, has_sensor: false },
  { compartment_id: "C-01", name: "Vestuário e higiene", category: "clothing", temp_min: 10, temp_max: 30, humidity_max: 65, has_sensor: false },
  { compartment_id: "W-01", name: "Resíduos", category: "waste", temp_min: 5, temp_max: 35, humidity_max: 90, has_sensor: false },
  { compartment_id: "P-01", name: "Suprimentos pessoais", category: "personal", temp_min: 10, temp_max: 28, humidity_max: 65, has_sensor: false },
].map((c) => ({ ...c, spacecraft_id: SPACECRAFT_ID }));

// Itens por compartimento: [nome, quantidade, capacidade, unidade, massa_kg_unitária, status?]
type ItemSeed = [string, number, number, string, number, ItemStatus?];

const itemsByCompartment: Record<string, ItemSeed[]> = {
  "M-03": [
    ["Insulina (refrig.)", 6, 12, "ampola", 0.01, "critical"],
    ["Vacinas", 40, 50, "un", 0.02],
    ["Bolsas de sangue O-", 12, 40, "un", 0.5, "critical"],
    ["Epinefrina", 30, 40, "ampola", 0.01],
    ["Soro fisiológico", 25, 30, "bolsa", 0.5],
  ],
  "M-01": [
    ["Analgésicos", 60, 80, "cartela", 0.02],
    ["Antibióticos", 45, 60, "cartela", 0.02],
    ["Curativos", 80, 100, "un", 0.01],
    ["Luvas cirúrgicas", 50, 60, "par", 0.01],
  ],
  "B-04": [
    ["Refeições refrigeradas", 48, 60, "un", 0.4],
    ["Vegetais frescos", 20, 40, "kg", 1.0, "low"],
    ["Laticínios", 30, 40, "un", 0.25],
    ["Sucos", 36, 48, "un", 0.3],
  ],
  "B-02": [
    ["Ração liofilizada", 22, 60, "pacote", 0.35, "low"],
    ["Barras energéticas", 120, 150, "un", 0.05],
    ["Café", 24, 30, "pacote", 0.25],
    ["Cereais", 30, 40, "pacote", 0.4],
  ],
  "A-01": [
    ["Água potável", 84, 100, "bolsa 2L", 2.0],
    ["Cartuchos de filtro", 8, 24, "un", 0.6, "low"],
  ],
  "S-01": [
    ["Kits de experimento", 15, 20, "un", 1.2],
    ["Placas de Petri", 50, 60, "un", 0.02],
    ["Reagentes", 24, 30, "frasco", 0.1],
  ],
  "S-02": [
    ["Amostras biológicas", 36, 50, "un", 0.05],
    ["Nitrogênio líquido", 4, 6, "cilindro", 8.0, "low"],
  ],
  "E-01": [
    ["Trajes EVA", 4, 6, "un", 55.0],
    ["Luvas EVA", 8, 12, "par", 1.5],
    ["Cilindros O2", 6, 16, "un", 6.0, "low"],
  ],
  "E-02": [
    ["Chaves combinadas", 20, 24, "un", 0.3],
    ["Multímetros", 4, 6, "un", 0.5],
    ["Kit de reparo", 6, 8, "un", 2.0],
    ["Fita Kapton", 15, 20, "rolo", 0.1],
  ],
  "C-01": [
    ["Uniformes", 16, 20, "un", 0.6],
    ["Kit de higiene", 24, 32, "un", 0.4],
    ["Toalhas", 30, 40, "un", 0.2],
  ],
  "W-01": [
    ["Sacos de resíduo", 60, 100, "un", 0.05],
    ["Recipientes selados", 12, 20, "un", 0.8],
  ],
  "P-01": [
    ["Itens pessoais", 20, 24, "un", 0.5],
    ["Tablets", 6, 8, "un", 0.4],
    ["Fones de ouvido", 8, 10, "un", 0.1],
  ],
};

// Prefixo de código e validade padrão por categoria
const CODE_PREFIX: Record<string, string> = {
  medical: "MED", food: "FD", water: "H2O", science: "SCI",
  equipment: "EQP", tools: "TLS", clothing: "CLT", waste: "WST", personal: "PSL",
};
const EXPIRY: Record<string, string> = {
  medical: "01/2027", food: "08/2026", water: "12/2027", science: "06/2027",
  equipment: "", tools: "", clothing: "", waste: "", personal: "",
};

function run(): void {
  upsertSpacecraft(spacecraft);

  let compartmentCount = 0;
  let itemCount = 0;
  let totalQuantity = 0;
  let codeSeq = 1;

  for (const compartment of compartments) {
    upsertCompartment(compartment);
    compartmentCount++;

    const seeds = itemsByCompartment[compartment.compartment_id] ?? [];
    seeds.forEach(([name, quantity, capacity, unit, mass_kg, status], index) => {
      const prefix = CODE_PREFIX[compartment.category] ?? "GEN";
      const item: Item = {
        item_id: `${SPACECRAFT_ID}-${compartment.compartment_id}-${index + 1}`,
        spacecraft_id: SPACECRAFT_ID,
        compartment_id: compartment.compartment_id,
        name,
        category: compartment.category,
        quantity,
        capacity,
        unit,
        mass_kg,
        code: `${prefix}-${String(100 + codeSeq).padStart(3, "0")}`,
        expiry: EXPIRY[compartment.category] ?? "",
        status: status ?? "nominal",
      };
      upsertItem(item);
      itemCount++;
      totalQuantity += quantity;
      codeSeq++;
    });
  }

  console.log(`Seed concluído para ${SPACECRAFT_ID}:`);
  console.log(`  ${compartmentCount} compartimentos`);
  console.log(`  ${itemCount} itens distintos (${totalQuantity} unidades no total)`);
}

run();
