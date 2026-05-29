// Gráfico de temperatura ao longo do tempo, por compartimento com sensor
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
import type { SpacecraftDetail, TelemetryEvent } from "../api/types";

interface Props {
  detail: SpacecraftDetail | null;
  events: TelemetryEvent[];
}

const PALETTE = ["#dc2626", "#16a34a", "#2563eb", "#f59e0b", "#9333ea", "#0891b2"];

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const TelemetryChart = ({ detail, events }: Props) => {
  const sensored = (detail?.compartments ?? []).filter((c) => c.has_sensor);
  const compIds = sensored.map((c) => c.compartment_id);

  // Agrupa as leituras por timestamp; cada ponto tem uma temperatura por compartimento
  const byTime = new Map<string, Record<string, number | string>>();
  for (const ev of events) {
    const reading = ev.payload;
    if (!compIds.includes(reading.compartment_id)) continue;
    const point =
      byTime.get(ev.timestamp) ??
      ({ time: fmtTime(ev.timestamp), ts: new Date(ev.timestamp).getTime() } as Record<
        string,
        number | string
      >);
    point[reading.compartment_id] = reading.current_temp;
    byTime.set(ev.timestamp, point);
  }
  const data = [...byTime.values()].sort((a, b) => (a.ts as number) - (b.ts as number));

  if (sensored.length === 0 || data.length === 0) {
    return (
      <div className="os-chart-empty">
        Sem telemetria disponível para os compartimentos com sensor.
      </div>
    );
  }

  return (
    <div className="os-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 16, right: 56, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#6b7280" }} minTickGap={40} />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            unit="°C"
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{ fontSize: 13, borderRadius: 8 }}
            labelStyle={{ color: "#111827" }}
          />
          <Legend />
          {sensored.map((c, i) => (
            <ReferenceLine
              key={`ref-${c.compartment_id}`}
              y={c.temp_max}
              stroke={PALETTE[i % PALETTE.length]}
              strokeDasharray="4 4"
              label={{
                value: `${c.temp_max}°C limite`,
                position: "right",
                fontSize: 11,
                fill: PALETTE[i % PALETTE.length],
              }}
            />
          ))}
          {sensored.map((c, i) => (
            <Line
              key={`line-${c.compartment_id}`}
              type="monotone"
              dataKey={c.compartment_id}
              name={`Compart. ${c.compartment_id} (${c.category})`}
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TelemetryChart;
