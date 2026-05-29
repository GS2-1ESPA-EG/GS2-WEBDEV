// Barra lateral de navegação do Mission Control
const NAV_ITEMS = [
  "Dashboard",
  "Frota Dragon",
  "Inventário",
  "Telemetria",
  "Previsão IA",
  "Alertas",
  "Relatórios",
  "Configurações",
];

interface Props {
  active: string;
  onNavigate: (item: string) => void;
}

const Sidebar = ({ active, onNavigate }: Props) => {
  return (
    <aside className="os-sidebar">
      <div className="os-brand">
        <span className="os-brand-title">OrbitStock</span>
        <span className="os-brand-sub">Mission Control</span>
      </div>
      <nav className="os-nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item}
            className={`os-nav-item${item === active ? " active" : ""}`}
            onClick={() => onNavigate(item)}
          >
            {item}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
