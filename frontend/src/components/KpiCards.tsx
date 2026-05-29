// Cartões de KPI do topo do dashboard, agregados a partir da frota
import type { FleetSummary } from "../api/types";

interface Props {
  fleet: FleetSummary[];
}

const KpiCards = ({ fleet }: Props) => {
  const total = fleet.length;
  const active = fleet.filter((s) => s.active).length;
  const items = fleet.reduce((n, s) => n + s.item_count, 0);
  const compartments = fleet.reduce((n, s) => n + s.compartment_count, 0);
  const alerts = fleet.reduce((n, s) => n + s.active_alerts, 0);
  const critical = fleet.reduce((n, s) => n + s.critical_alerts, 0);
  const warning = fleet.reduce((n, s) => n + s.warning_alerts, 0);
  const sensored = fleet.reduce((n, s) => n + s.sensored_compartments, 0);
  const nominal = fleet.reduce((n, s) => n + s.nominal_compartments, 0);
  const health = sensored > 0 ? Math.round((nominal / sensored) * 1000) / 10 : 100;

  return (
    <section className="os-kpis">
      <div className="os-kpi">
        <span className="os-kpi-label">DRAGON ATIVAS</span>
        <span className="os-kpi-value">{active}</span>
        <span className="os-kpi-foot os-good">
          {active === total ? "todas operacionais" : `${total - active} inativa(s)`}
        </span>
      </div>

      <div className="os-kpi">
        <span className="os-kpi-label">ITENS MONITORADOS</span>
        <span className="os-kpi-value">{items.toLocaleString("pt-BR")}</span>
        <span className="os-kpi-foot">em {compartments} compartimentos</span>
      </div>

      <div className="os-kpi">
        <span className="os-kpi-label">ALERTAS ATIVOS</span>
        <span className={`os-kpi-value${alerts > 0 ? " os-bad" : ""}`}>{alerts}</span>
        <span className={`os-kpi-foot${critical > 0 ? " os-bad" : ""}`}>
          {alerts > 0 ? `${critical} crítico · ${warning} atenção` : "nenhum alerta"}
        </span>
      </div>

      <div className="os-kpi">
        <span className="os-kpi-label">TELEMETRIA NOMINAL</span>
        <span className="os-kpi-value os-good">{health}%</span>
        <span className="os-kpi-foot">
          {nominal}/{sensored} compartimentos com sensor
        </span>
      </div>
    </section>
  );
};

export default KpiCards;
