// Tela 01 — App do astronauta (a bordo da Dragon). Página dark que simula o tablet de bordo.
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SpacecraftDetail, Item, Alert } from "../api/types";
import { fetchFleet, fetchSpacecraft, consumeItem } from "../api/client";
import "./astronaut.css";

const STATUS_COLOR: Record<string, string> = {
  nominal: "#22c55e",
  low: "#f59e0b",
  critical: "#ef4444",
  unknown: "#64748b",
};

const CATEGORY_LABEL: Record<string, string> = {
  medical: "Médico",
  food: "Alimentação",
  water: "Água",
  science: "Ciência",
  equipment: "Equipamentos",
  tools: "Ferramentas",
  clothing: "Vestuário",
  waste: "Resíduos",
  personal: "Pessoal",
};

// Lançamento fictício da missão (para o cronômetro T+)
const LAUNCH = new Date("2026-05-28T12:00:00Z").getTime();

function formatElapsed(now: number): string {
  const s = Math.max(0, Math.floor((now - LAUNCH) / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `T+${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

const AstronautApp = () => {
  const navigate = useNavigate();
  const [detail, setDetail] = useState<SpacecraftDetail | null>(null);
  const [spacecraftId, setSpacecraftId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetchFleet()
      .then((f) => {
        const id = f[0]?.spacecraft_id;
        if (!id) throw new Error("Nenhuma nave disponível");
        setSpacecraftId(id);
        return fetchSpacecraft(id);
      })
      .then(setDetail)
      .catch((err) => setError((err as Error).message));
  }, []);

  async function handleConsume(item: Item) {
    const amount = amounts[item.item_id] ?? 1;
    setBusyId(item.item_id);
    setError(null);
    try {
      await consumeItem(item.item_id, amount);
      if (spacecraftId) setDetail(await fetchSpacecraft(spacecraftId));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const items: Item[] = useMemo(
    () => (detail?.compartments ?? []).flatMap((c) => c.items),
    [detail]
  );
  const alerts: Alert[] = useMemo(
    () => (detail?.compartments ?? []).flatMap((c) => c.state?.alerts ?? []),
    [detail]
  );
  const totalUnits = items.reduce((s, i) => s + i.quantity, 0);
  const compartmentCount = detail?.compartments.length ?? 0;

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = items.filter((i) => {
    if (category !== "all" && i.category !== category) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      i.name.toLowerCase().includes(q) ||
      i.code.toLowerCase().includes(q) ||
      i.compartment_id.toLowerCase().includes(q)
    );
  });

  const activeAlert = alerts.find((a) => !dismissed.has(a.alert_id));

  return (
    <div className="ast-root">
      <div className="ast-device">
        {/* Topo: identificação da missão */}
        <header className="ast-topbar">
          <button className="ast-back" onClick={() => navigate("/dashboard")}>
            ← Mission Control
          </button>
          <div className="ast-mission">
            {detail
              ? `${detail.name.toUpperCase()} · MISSÃO ${detail.mission.split(" ")[0]} · ${formatElapsed(now)}`
              : "Conectando…"}
          </div>
          <div className="ast-online">
            <span className="ast-online-dot" /> ONLINE
          </div>
        </header>

        <h1 className="ast-title">Inventário de bordo</h1>
        <p className="ast-subtitle">
          {totalUnits} itens · {compartmentCount} compartimentos · {alerts.length} alertas ativos
        </p>

        {error && <div className="ast-error">Sem conexão com o backend: {error}</div>}

        {/* Busca + filtros */}
        <div className="ast-controls">
          <input
            className="ast-search"
            placeholder="Buscar item, código ou compartimento..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="ast-filters">
            {categories.map((c) => (
              <button
                key={c}
                className={`ast-chip${category === c ? " active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c === "all" ? "Todos" : CATEGORY_LABEL[c] ?? c}
              </button>
            ))}
          </div>
        </div>

        {/* Alerta crítico ativo */}
        {activeAlert && (
          <div className={`ast-alert ${activeAlert.level}`}>
            <div className="ast-alert-text">
              <strong>
                ! ALERTA {activeAlert.level === "critical" ? "CRÍTICO" : "ATENÇÃO"} ·{" "}
                {alertTitle(activeAlert)}
              </strong>
              <span>{activeAlert.message}</span>
              <span className="ast-alert-sub">
                Compartimento {activeAlert.compartment_id}
              </span>
            </div>
            <button
              className="ast-resolve"
              onClick={() =>
                setDismissed((prev) => new Set(prev).add(activeAlert.alert_id))
              }
            >
              RESOLVER
            </button>
          </div>
        )}

        {/* Cartões de item */}
        <div className="ast-grid">
          {filtered.map((item) => {
            const color = STATUS_COLOR[item.status] ?? STATUS_COLOR.unknown;
            const pct = item.capacity > 0 ? Math.round((item.quantity / item.capacity) * 100) : 0;
            return (
              <div key={item.item_id} className="ast-card">
                <div className="ast-card-bar" style={{ background: color }} />
                <div className="ast-card-body">
                  <div className="ast-card-name">{item.name}</div>
                  <div className="ast-card-code">
                    {item.unit} · Cod. {item.code}
                  </div>
                  <div className="ast-card-rows">
                    <div>
                      <span>Localização:</span>
                      <b>Comp. {item.compartment_id}</b>
                    </div>
                    <div>
                      <span>Quantidade:</span>
                      <b style={{ color }}>
                        {item.quantity} / {item.capacity}
                      </b>
                    </div>
                    <div>
                      <span>Validade:</span>
                      <b>{item.expiry || "—"}</b>
                    </div>
                  </div>
                  <div className="ast-progress">
                    <div className="ast-progress-track">
                      <div
                        className="ast-progress-fill"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                    <span className="ast-progress-pct">{pct}%</span>
                  </div>

                  <div className="ast-consume">
                    <input
                      type="number"
                      min={1}
                      max={item.quantity}
                      value={amounts[item.item_id] ?? 1}
                      onChange={(e) =>
                        setAmounts((prev) => ({
                          ...prev,
                          [item.item_id]: Math.max(1, Number(e.target.value) || 1),
                        }))
                      }
                      className="ast-consume-input"
                    />
                    <button
                      className="ast-consume-btn"
                      disabled={busyId === item.item_id || item.quantity <= 0}
                      onClick={() => handleConsume(item)}
                    >
                      {busyId === item.item_id ? "…" : "Dar baixa"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && !error && (
            <div className="ast-empty">Nenhum item encontrado.</div>
          )}
        </div>

        {/* Navegação inferior (simulada) */}
        <nav className="ast-bottomnav">
          {["Inventário", "Alertas", "Consumo", "Compartimentos", "Config"].map((t) => (
            <span key={t} className={`ast-tab${t === "Inventário" ? " active" : ""}`}>
              {t}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
};

function alertTitle(a: Alert): string {
  switch (a.type) {
    case "temperature":
      return "Temperatura fora da faixa";
    case "humidity":
      return "Umidade fora da faixa";
    case "door":
      return "Compartimento aberto";
    case "impact":
      return "Impacto detectado";
    default:
      return "Alerta";
  }
}

export default AstronautApp;
