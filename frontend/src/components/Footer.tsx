import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="os-footer">
    <div className="os-footer-inner">
      <div className="os-footer-brand">
        <strong>OrbitStock</strong>
        <span>Mission Control System — FIAP 2026 · GS2 Web Development</span>
      </div>
      <nav className="os-footer-links" aria-label="Links do rodapé">
        <Link to="/problema">Problema</Link>
        <Link to="/tecnologia">Tecnologia</Link>
        <Link to="/objetivos">Objetivos</Link>
        <Link to="/beneficios">Benefícios</Link>
        <Link to="/aplicacao">Aplicação</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
    </div>
    <p className="os-footer-copy">
      © 2026 OrbitStock · Desenvolvido para fins acadêmicos · Dados fictícios
    </p>
  </footer>
)

export default Footer
