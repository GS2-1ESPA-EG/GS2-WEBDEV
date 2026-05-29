// Gráficos cobrindo todos os compartimentos da nave: itens e ocupação (%)
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { SpacecraftDetail } from "../api/types";

interface Props {
  detail: SpacecraftDetail | null;
}

function occupancyColor(pct: number): string {
  if (pct < 25) return "#dc2626";
  if (pct < 50) return "#f59e0b";
  return "#16a34a";
}

const CompartmentsCharts = ({ detail }: Props) => {
  const compartments = detail?.compartments ?? [];
  if (compartments.length === 0) {
    return <div className="os-chart-empty">Carregando compartimentos…</div>;
  }

  const itemsData = compartments.map((c) => ({
    id: c.compartment_id,
    name: c.name,
    items: c.item_count,
  }));

  const occupancyData = compartments.map((c) => {
    const qty = c.items.reduce((s, i) => s + i.quantity, 0);
    const cap = c.items.reduce((s, i) => s + i.capacity, 0);
    return {
      id: c.compartment_id,
      name: c.name,
      pct: cap > 0 ? Math.round((qty / cap) * 100) : 0,
    };
  });

  return (
    <div className="os-comp-charts">
      <div>
        <h3 className="os-comp-title">Itens por compartimento</h3>
        <div className="os-chart">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={itemsData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="id" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
              <Tooltip
                contentStyle={{ fontSize: 13, borderRadius: 8 }}
                formatter={(v) => [`${v} unidades`, "Itens"]}
                labelFormatter={(id) =>
                  itemsData.find((d) => d.id === id)?.name ?? String(id)
                }
              />
              <Bar dataKey="items" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="os-comp-title">Ocupação por compartimento (%)</h3>
        <div className="os-chart">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={occupancyData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="id" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 12, fill: "#6b7280" }} />
              <Tooltip
                contentStyle={{ fontSize: 13, borderRadius: 8 }}
                formatter={(v) => [`${v}%`, "Ocupação"]}
                labelFormatter={(id) =>
                  occupancyData.find((d) => d.id === id)?.name ?? String(id)
                }
              />
              <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                {occupancyData.map((d) => (
                  <Cell key={d.id} fill={occupancyColor(d.pct)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CompartmentsCharts;
