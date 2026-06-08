import './pages.css'

const OBJETIVOS = [
  {
    title: 'Monitoramento em Tempo Real',
    desc: 'Acompanhar continuamente temperatura, umidade e estoque de todos os compartimentos das naves Dragon, com atualização automática a cada 5 segundos.',
  },
  {
    title: 'Prevenção de Escassez',
    desc: 'Identificar antecipadamente quais suprimentos estão em risco de esgotamento antes do próximo reabastecimento planejado, evitando situações críticas.',
  },
  {
    title: 'Apoio à Tripulação',
    desc: 'Fornecer ao astronauta uma interface intuitiva para registrar consumo de itens, visualizar alertas e gerenciar o inventário de bordo de forma autônoma.',
  },
  {
    title: 'Análise Preditiva com IA',
    desc: 'Aplicar regressão linear sobre dados de telemetria e gerar relatórios em linguagem natural via Claude (Anthropic), indicando riscos e recomendações de ação.',
  },
  {
    title: 'Redução de Custos Operacionais',
    desc: 'Minimizar desperdício de suprimentos e evitar missões de reabastecimento emergencial, que custam dezenas de milhões de dólares por lançamento.',
  },
]

const Objetivos = () => (
  <div className="page">
    <div className="page-hero">
      <span className="page-tag">Missão</span>
      <h1>Objetivos</h1>
      <p>
        O OrbitStock foi desenvolvido com um conjunto claro de objetivos, centrados
        na segurança da tripulação e na eficiência operacional de missões espaciais
        de longa duração.
      </p>
    </div>

    <div className="page-highlight">
      <strong>Missão:</strong> Garantir que nenhuma nave da frota Dragon fique sem
      recursos críticos durante sua missão, através de monitoramento inteligente e
      previsão baseada em dados reais de telemetria.
    </div>

    <p className="page-section-title">Objetivos do sistema</p>
    <div className="page-steps">
      {OBJETIVOS.map(({ title, desc }, i) => (
        <div key={title} className="page-step">
          <div className="page-step-num">{i + 1}</div>
          <div className="page-step-body">
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        </div>
      ))}
    </div>

    <p className="page-section-title">Metas quantitativas</p>
    <div className="page-stats">
      <div className="page-stat">
        <div className="page-stat-value">0</div>
        <div className="page-stat-label">ocorrências de escassez não previstas</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value">12h</div>
        <div className="page-stat-label">antecedência mínima de alerta</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value">100%</div>
        <div className="page-stat-label">rastreabilidade de consumo</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value">24/7</div>
        <div className="page-stat-label">monitoramento contínuo</div>
      </div>
    </div>

    <p className="page-section-title">Públicos-alvo</p>
    <div className="page-grid">
      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#eff6ff' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de astronauta">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Astronautas</h3>
        <p>Interface de tablet para gestão autônoma do inventário de bordo durante a missão.</p>
      </div>
      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#f0fdf4' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de controle de missão">
            <path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Controle de Missão</h3>
        <p>Dashboard de visão geral da frota com KPIs, telemetria e análises preditivas.</p>
      </div>
      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#fdf4ff' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de planejamento">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Planejamento de Missão</h3>
        <p>Dados históricos e projeções para planejar ressuprimentos e configurar próximas missões.</p>
      </div>
    </div>
  </div>
)

export default Objetivos
