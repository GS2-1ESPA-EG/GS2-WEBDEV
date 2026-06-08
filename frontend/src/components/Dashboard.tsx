// Tela de controle de missão: KPIs, frota e telemetria, com atualização periódica
import { useEffect, useState } from "react";
import type { FleetSummary, SpacecraftDetail, TelemetryEvent } from "../api/types";
import { fetchFleet, fetchSpacecraft, fetchEvents } from "../api/client";
import { timeAgo } from "./statusMeta";
import KpiCards from "./KpiCards";
import FleetCard from "./FleetCard";
import TelemetryChart from "./TelemetryChart";
import CompartmentsCharts from "./CompartmentsCharts";

const REFRESH_MS = 5000;
const WINDOW_HOURS = 6;

const Dashboard = () => {
  const [fleet, setFleet] = useState<FleetSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SpacecraftDetail | null>(null);
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, forceTick] = useState(0); // re-render periódico para o "há X segundos"

  // Polling da visão geral da frota
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await fetchFleet();
        if (!active) return;
        setFleet(data);
        setError(null);
        setSelectedId((prev) => prev ?? data[0]?.spacecraft_id ?? null);
      } catch (err) {
        if (active) setError((err as Error).message);
      }
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  // Polling do detalhe + telemetria da nave selecionada
  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    const load = async () => {
      try {
        const since = new Date(Date.now() - WINDOW_HOURS * 3600 * 1000).toISOString();
        const [d, ev] = await Promise.all([
          fetchSpacecraft(selectedId),
          fetchEvents(selectedId, since),
        ]);
        if (!active) return;
        setDetail(d);
        setEvents(ev);
        setUpdatedAt(new Date().toISOString());
        setError(null);
      } catch (err) {
        if (active) setError((err as Error).message);
      }
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [selectedId]);

  // Atualiza o rótulo "há X segundos" a cada segundo
  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const inMission = fleet.filter((s) => s.active).length;
  const critical = fleet.reduce((n, s) => n + s.critical_alerts, 0);
  const selected = fleet.find((s) => s.spacecraft_id === selectedId) ?? null;

  return (
    <>
      {error && (
          <div className="os-error">
            Sem conexão com o backend ({error}). Verifique se o servidor está em
            http://localhost:3000.
          </div>
        )}

        <header className="os-header">
          <h1>Visão geral da frota</h1>
          <p className="os-subtitle">
            Atualizado {timeAgo(updatedAt)} · {inMission} Dragon em missão ·{" "}
            <span className={critical > 0 ? "os-bad" : undefined}>
              {critical} alerta{critical === 1 ? "" : "s"} crítico{critical === 1 ? "" : "s"}
            </span>
          </p>
        </header>

        <KpiCards fleet={fleet} />

        <h2 className="os-section-title">Frota em operação</h2>
        <section className="os-fleet">
          {fleet.map((s) => (
            <FleetCard
              key={s.spacecraft_id}
              summary={s}
              selected={s.spacecraft_id === selectedId}
              onSelect={setSelectedId}
            />
          ))}
          {fleet.length === 0 && !error && (
            <div className="os-fleet-empty">Carregando frota…</div>
          )}
        </section>

        <h2 className="os-section-title">
          Telemetria · {selected?.name ?? "—"} · últimas {WINDOW_HOURS} horas
        </h2>
        <TelemetryChart detail={detail} events={events} />

        <h2 className="os-section-title" style={{ marginTop: 32 }}>
          Compartimentos · {selected?.name ?? "—"}
        </h2>
        <CompartmentsCharts detail={detail} />
    </>
  );
};

export default Dashboard;
