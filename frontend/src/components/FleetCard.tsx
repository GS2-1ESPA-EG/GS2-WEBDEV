// Cartão de uma nave na "Visão geral da frota"
import type { FleetSummary } from "../api/types";
import { STATUS_META } from "./statusMeta";

interface Props {
  summary: FleetSummary;
  selected: boolean;
  onSelect: (spacecraftId: string) => void;
}

const FleetCard = ({ summary, selected, onSelect }: Props) => {
  const meta = STATUS_META[summary.status];

  const highlight =
    summary.critical_alerts > 0
      ? `${summary.critical_alerts} alerta(s) crítico(s)`
      : summary.warning_alerts > 0
        ? `${summary.warning_alerts} compartimento(s) em atenção`
        : "Todos os parâmetros normais";

  return (
    <button
      type="button"
      className={`os-fleet-card${selected ? " selected" : ""}`}
      style={{ borderColor: selected ? meta.color : undefined }}
      onClick={() => onSelect(summary.spacecraft_id)}
    >
      <div className="os-fleet-head">
        <span className="os-fleet-name">
          <span className="os-dot" style={{ background: meta.color }} />
          {summary.name}
        </span>
        <span className="os-fleet-status" style={{ color: meta.color }}>
          • {meta.label}
        </span>
      </div>

      <div className="os-fleet-mission">{summary.mission}</div>

      <div className="os-fleet-rows">
        <div>Tripulação: <b>{summary.crew_count}</b></div>
        <div>
          Itens: <b>{summary.item_count.toLocaleString("pt-BR")}</b> ·{" "}
          <b>{summary.compartment_count}</b> compart.
        </div>
      </div>

      <div
        className="os-fleet-highlight"
        style={{ color: meta.color }}
      >
        {summary.status === "nominal" ? "OK " : "! "}
        {highlight}
      </div>

      <div className="os-fleet-foot">
        {summary.sensored_compartments} compart. com sensor ativo
      </div>
    </button>
  );
};

export default FleetCard;
