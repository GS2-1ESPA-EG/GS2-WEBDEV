// Gráfico de projeção: histórico (linha sólida) + projeção (tracejada) + linha de limite
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import type { CompartmentProjection } from "../api/types";

function fmt(ts: number): string {
  return new Date(ts).toLocaleString("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PredictionChart = ({ projection }: { projection: CompartmentProjection }) => {
  const data = [
    ...projection.points.map((p) => ({ ts: Date.parse(p.t), real: p.value })),
    ...projection.forecast.map((p) => ({ ts: Date.parse(p.t), forecast: p.value })),
  ];

  return (
    <div className="os-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 16, right: 64, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="ts"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={fmt}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            minTickGap={70}
          />
          <YAxis unit="°C" tick={{ fontSize: 12, fill: "#6b7280" }} domain={["auto", "auto"]} />
          <Tooltip
            labelFormatter={(v) => fmt(Number(v))}
            contentStyle={{ fontSize: 13, borderRadius: 8 }}
          />
          <Legend />
          <ReferenceLine
            y={projection.limit}
            stroke="#dc2626"
            strokeDasharray="4 4"
            label={{
              value: `${projection.limit}${projection.unit} limite`,
              position: "right",
              fontSize: 11,
              fill: "#dc2626",
            }}
          />
          <Line
            dataKey="real"
            name="Temperatura (real)"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            dataKey="forecast"
            name="Projeção"
            stroke="#dc2626"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;
