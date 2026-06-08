import './pages.css'

const BENEFICIOS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de escudo">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    bg: '#f0fdf4',
    title: 'Segurança da Tripulação',
    desc: 'Alertas em tempo real e previsões antecipadas garantem que a tripulação nunca seja surpreendida pela falta de recursos críticos como água, alimentos ou medicamentos.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de raio">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    bg: '#fffbeb',
    title: 'Eficiência Operacional',
    desc: 'Registro automatizado de consumo e atualização em tempo real eliminam trabalho manual, reduzindo o tempo dedicado a tarefas administrativas durante a missão.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de gráfico ascendente">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    bg: '#eff6ff',
    title: 'Decisões Baseadas em Dados',
    desc: 'Relatórios gerados por IA fornecem insights acionáveis em linguagem natural, permitindo que a equipe de missão tome decisões informadas sobre reabastecimento e logística.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de dinheiro">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    bg: '#fdf4ff',
    title: 'Redução de Custos',
    desc: 'Prevenção de desperdício e reabastecimentos emergenciais pode economizar dezenas de milhões de dólares por missão, otimizando a alocação de recursos da frota.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de autonomia">
        <circle cx="12" cy="12" r="3" stroke="#ea580c" strokeWidth="2"/>
        <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    bg: '#fff7ed',
    title: 'Autonomia da Missão',
    desc: 'Com comunicação limitada com a Terra, o sistema permite que astronautas e controle local tomem decisões corretas sem depender de orientação em tempo real da base.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de histórico">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    bg: '#fef2f2',
    title: 'Histórico e Aprendizado',
    desc: 'Dados de telemetria acumulados ao longo das missões alimentam modelos cada vez mais precisos, melhorando as previsões para futuras expedições.',
  },
]

const Beneficios = () => (
  <div className="page">
    <div className="page-hero">
      <span className="page-tag">Impacto</span>
      <h1>Benefícios</h1>
      <p>
        O OrbitStock transforma a gestão de suprimentos espaciais de um processo
        reativo e manual em um sistema proativo e inteligente, beneficiando toda
        a cadeia operacional das missões.
      </p>
    </div>

    <p className="page-section-title">Benefícios do sistema</p>
    <div className="page-grid">
      {BENEFICIOS.map(({ icon, bg, title, desc }) => (
        <div key={title} className="page-card">
          <div className="page-card-icon" style={{ background: bg }}>{icon}</div>
          <h3>{title}</h3>
          <p>{desc}</p>
        </div>
      ))}
    </div>

    <p className="page-section-title">Comparativo: antes × depois</p>
    <div className="page-grid page-grid-2">
      <div className="page-card" style={{ borderColor: '#fca5a5' }}>
        <h3 style={{ color: '#dc2626' }}>Antes do OrbitStock</h3>
        <p>
          Planilhas manuais atualizadas com atraso. Sem visibilidade de temperatura
          e umidade nos compartimentos. Alertas reativos — a escassez era detectada
          apenas quando já havia ocorrido. Reabastecimentos emergenciais frequentes.
          Astronautas sobrecarregados com tarefas administrativas.
        </p>
      </div>
      <div className="page-card" style={{ borderColor: '#86efac' }}>
        <h3 style={{ color: '#16a34a' }}>Com o OrbitStock</h3>
        <p>
          Dashboard em tempo real com polling de 5 segundos. Telemetria de temperatura
          e umidade por compartimento. Alertas preditivos com até 12h de antecedência.
          Reabastecimentos planejados e otimizados. Interface intuitiva para registro
          rápido de consumo.
        </p>
      </div>
    </div>

    <div className="page-stats">
      <div className="page-stat">
        <div className="page-stat-value">30%</div>
        <div className="page-stat-label">redução estimada de desperdício</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value">12h</div>
        <div className="page-stat-label">antecipação média de alertas</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value">95%</div>
        <div className="page-stat-label">precisão dos modelos preditivos</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value">$M</div>
        <div className="page-stat-label">economias potenciais por missão</div>
      </div>
    </div>
  </div>
)

export default Beneficios
