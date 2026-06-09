import { useEffect, useState } from 'react'
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

const Sidebar = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
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
        <button
          className="os-theme-toggle"
          onClick={() => setDark(d => !d)}
          aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          {dark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {dark ? 'Modo claro' : 'Modo escuro'}
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
