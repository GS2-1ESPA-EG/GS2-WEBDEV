import './pages.css'

const Tecnologia = () => (
  <div className="page">
    <div className="page-hero">
      <span className="page-tag">Stack</span>
      <h1>Tecnologia</h1>
      <p>
        O OrbitStock combina tecnologias modernas de front-end, back-end e inteligência
        artificial para entregar monitoramento em tempo real com análise preditiva
        baseada em dados.
      </p>
    </div>

    <p className="page-section-title">Tecnologias utilizadas</p>
    <div className="page-badges">
      {['React 19', 'TypeScript', 'React Router DOM', 'Recharts', 'Vite',
        'Node.js 22', 'Express 5', 'SQLite', 'Claude AI (Anthropic)',
        'CSS3 + Flexbox', 'Google Fonts', 'REST API'].map((t) => (
        <span key={t} className="page-badge">{t}</span>
      ))}
    </div>

    <p className="page-section-title">Camadas da arquitetura</p>
    <div className="page-grid page-grid-2">
      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#eff6ff' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de interface">
            <rect x="2" y="3" width="20" height="14" rx="2" stroke="#2563eb" strokeWidth="2"/>
            <path d="M8 21h8M12 17v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h3>Front-end (React + TypeScript)</h3>
        <p>
          SPA construída com React 19 e TypeScript. Usa React Router DOM para
          navegação entre páginas, Recharts para visualização de telemetria e
          CSS3 com variáveis e Flexbox para layout responsivo.
        </p>
      </div>

      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#f0fdf4' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de servidor">
            <rect x="2" y="2" width="20" height="8" rx="2" stroke="#16a34a" strokeWidth="2"/>
            <rect x="2" y="14" width="20" height="8" rx="2" stroke="#16a34a" strokeWidth="2"/>
            <path d="M6 6h.01M6 18h.01" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h3>Back-end (Node.js + Express)</h3>
        <p>
          API REST com Express 5 em Node.js 22. Exposição de endpoints para frota,
          telemetria, inventário e geração de relatórios. Banco de dados SQLite
          embutido para persistência leve e portátil.
        </p>
      </div>

      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#fdf4ff' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de IA">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>IA Preditiva (Anthropic Claude)</h3>
        <p>
          Análise de regressão linear sobre dados de telemetria combinada com o
          modelo Claude da Anthropic. Gera relatórios em linguagem natural com
          previsões de violação de limites e recomendações de ação.
        </p>
      </div>

      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#fffbeb' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de banco de dados">
            <ellipse cx="12" cy="5" rx="9" ry="3" stroke="#f59e0b" strokeWidth="2"/>
            <path d="M21 12c0 1.657-4.03 3-9 3S3 13.657 3 12" stroke="#f59e0b" strokeWidth="2"/>
            <path d="M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5" stroke="#f59e0b" strokeWidth="2"/>
          </svg>
        </div>
        <h3>Dados (SQLite + JSON)</h3>
        <p>
          SQLite para persistência de telemetria, inventário e alertas. Dados
          fictícios para simulação realista de missão, incluindo leituras de
          temperatura, umidade e consumo de itens.
        </p>
      </div>
    </div>

    <p className="page-section-title">Endpoints da API</p>
    <div className="page-steps">
      {[
        { method: 'GET', color: '#16a34a', path: '/api/fleet', desc: 'Lista todas as naves da frota com status, alertas ativos e contagem de compartimentos.' },
        { method: 'GET', color: '#16a34a', path: '/api/telemetry/events/:id', desc: 'Retorna eventos de telemetria de uma nave em uma janela de tempo configurável.' },
        { method: 'POST', color: '#2563eb', path: '/api/predictions/generate', desc: 'Dispara análise preditiva com regressão + LLM e retorna relatório em linguagem natural.' },
        { method: 'POST', color: '#2563eb', path: '/api/items/:id/consume', desc: 'Registra consumo de item pelo astronauta, atualiza estoque e recalcula status.' },
      ].map(({ method, color, path, desc }) => (
        <div key={path} className="page-step">
          <div className="page-step-num" style={{ background: color, fontSize: 11, width: 46, borderRadius: 6 }}>
            {method}
          </div>
          <div className="page-step-body">
            <h3>{path}</h3>
            <p>{desc}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="page-stats">
      <div className="page-stat">
        <div className="page-stat-value">5s</div>
        <div className="page-stat-label">intervalo de atualização</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value">6h</div>
        <div className="page-stat-label">janela de telemetria</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value">12h</div>
        <div className="page-stat-label">horizonte de previsão IA</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value">R²</div>
        <div className="page-stat-label">coeficiente de determinação</div>
      </div>
    </div>
  </div>
)

export default Tecnologia
