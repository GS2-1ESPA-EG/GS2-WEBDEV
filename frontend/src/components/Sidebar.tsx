import { NavLink } from 'react-router-dom'

const CONTENT_ITEMS = [
  { label: 'Problema', to: '/problema' },
  { label: 'Tecnologia', to: '/tecnologia' },
  { label: 'Objetivos', to: '/objetivos' },
  { label: 'Benefícios', to: '/beneficios' },
  { label: 'Aplicação', to: '/aplicacao' },
]

const SYSTEM_ITEMS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Previsão IA', to: '/predicao' },
  { label: 'Inventário', to: '/inventario' },
]

const Sidebar = () => (
  <aside className="os-sidebar">
    <div className="os-brand">
      <span className="os-brand-title">OrbitStock</span>
      <span className="os-brand-sub">Mission Control</span>
    </div>
    <nav className="os-nav" aria-label="Navegação principal">
      <span className="os-nav-group">Conteúdo</span>
      {CONTENT_ITEMS.map(({ label, to }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `os-nav-item${isActive ? ' active' : ''}`}
        >
          {label}
        </NavLink>
      ))}
      <span className="os-nav-group">Sistema</span>
      {SYSTEM_ITEMS.map(({ label, to }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `os-nav-item${isActive ? ' active' : ''}`}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
)

export default Sidebar
