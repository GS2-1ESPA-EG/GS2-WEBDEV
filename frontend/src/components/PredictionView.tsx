// Tela de IA Preditiva: dispara a análise (regressão + Claude) e renderiza o relatório
import { useEffect, useState } from "react";
import type { FleetSummary, PredictionReport, RiskLevel } from "../api/types";
import { fetchFleet, generatePrediction } from "../api/client";
import PredictionChart from "./PredictionChart";

const RISK_META: Record<RiskLevel, { label: string; color: string }> = {
  low: { label: "RISCO BAIXO", color: "#16a34a" },
  medium: { label: "RISCO MÉDIO", color: "#f59e0b" },
  high: { label: "RISCO ALTO IDENTIFICADO", color: "#dc2626" },
};

const PredictionView = () => {
  const [fleet, setFleet] = useState<FleetSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [report, setReport] = useState<PredictionReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFleet()
      .then((f) => {
        setFleet(f);
        setSelectedId((prev) => prev ?? f[0]?.spacecraft_id ?? null);
      })
      .catch((err) => setError((err as Error).message));
  }, []);

  async function handleGenerate() {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    try {
      setReport(await generatePrediction(selectedId, 12));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const selected = fleet.find((s) => s.spacecraft_id === selectedId);
  const risk = report ? RISK_META[report.risk_level] : null;

  return (
    <>
      <div className="os-pred-head">
          <div>
            <h1>Análise preditiva{selected ? ` — ${selected.name}` : ""}</h1>
            <p className="os-subtitle">
              {report
                ? `Gerado por regressão + LLM Anthropic (${report.model}) · ${new Date(
                    report.generated_at
                  ).toLocaleString("pt-BR")}`
                : "Regressão sobre telemetria + LLM gera análise em linguagem natural"}
            </p>
          </div>
          {risk && (
            <span
              className="os-risk-badge"
              style={{ color: risk.color, borderColor: risk.color }}
            >
              ! {risk.label}
            </span>
          )}
        </div>

        {error && <div className="os-error">Erro: {error}</div>}

        {!report && !loading && (
          <button className="os-btn-primary" onClick={handleGenerate} disabled={!selectedId}>
            Gerar análise preditiva
          </button>
        )}

        {loading && (
          <div className="os-pred-loading">Gerando análise com o Claude… (pode levar alguns segundos)</div>
        )}

        {report && (
          <>
            <div className="os-card os-pred-summary">
              <h3>Resumo executivo</h3>
              <p>{report.summary}</p>

              <h3 style={{ marginTop: 18 }}>Recomendações</h3>
              <ol className="os-pred-recs">
                {report.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ol>

              <p className="os-pred-conf">
                Confiança da previsão: <b>{report.confidence_pct}%</b>
                {report.projections[0] ? ` · R² = ${report.projections[0].r_squared}` : ""} —{" "}
                {report.confidence_note}
              </p>
            </div>

            {report.projections.length > 0 ? (
              report.projections.map((p) => (
                <div key={p.compartment_id}>
                  <h2 className="os-section-title">
                    Projeção · Compart. {p.compartment_id} ({p.name}) · próximas {report.horizon_hours}h
                  </h2>
                  <PredictionChart projection={p} />
                  <p className="os-subtitle" style={{ marginTop: 8 }}>
                    Atual {p.current_value}
                    {p.unit} · limite {p.limit}
                    {p.unit} · tendência {p.slope_per_hour}
                    {p.unit}/h ·{" "}
                    {p.breach_in_hours !== null
                      ? `violação projetada em ~${p.breach_in_hours}h`
                      : "sem violação projetada na janela"}
                  </p>
                </div>
              ))
            ) : (
              <p className="os-subtitle">
                Nenhum compartimento com sensor disponível para projeção.
              </p>
            )}

            {report.item_projections.length > 0 && (
              <>
                <h2 className="os-section-title" style={{ marginTop: 28 }}>
                  Consumo de itens alterados · projeção de depleção
                </h2>
                <div className="os-pred-items">
                  {report.item_projections.map((p) => (
                    <div key={p.item_id} className="os-card os-pred-item">
                      <div className="os-pred-item-name">{p.name}</div>
                      <div className="os-pred-item-sub">
                        Comp. {p.compartment_id} · {p.current_quantity}/{p.capacity} {p.unit}
                      </div>
                      <div className="os-pred-item-row">
                        Tendência:{" "}
                        <b>
                          {p.slope_per_hour} {p.unit}/h
                        </b>
                      </div>
                      <div className="os-pred-item-row">
                        Depleção:{" "}
                        <b style={{ color: p.depletion_in_hours !== null ? "#dc2626" : "#16a34a" }}>
                          {p.depletion_in_hours !== null
                            ? `~${p.depletion_in_hours}h`
                            : "sem consumo / estável"}
                        </b>
                      </div>
                      <div className="os-pred-item-row os-pred-item-r2">R² = {p.r_squared}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <button className="os-btn-secondary" onClick={handleGenerate} style={{ marginTop: 20 }}>
              Gerar novamente
            </button>
          </>
        )}
    </>
  );
};

export default PredictionView;
