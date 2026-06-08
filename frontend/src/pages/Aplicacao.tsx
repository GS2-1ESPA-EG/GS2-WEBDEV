import './pages.css'

const ROTINA = [
  {
    hora: '06:00',
    title: 'Verificação Matinal',
    desc: 'Ao acordar, o astronauta abre o app e consulta o painel de status. Verifica se há alertas críticos ou avisos gerados durante a noite e revisa o estoque geral.',
  },
  {
    hora: '08:30',
    title: 'Registro de Consumo do Café da Manhã',
    desc: 'Após a refeição, registra o consumo de alimentos e água pelo app. O sistema atualiza o estoque automaticamente e recalcula o status dos itens.',
  },
  {
    hora: '12:00',
    title: 'Monitoramento de Telemetria',
    desc: 'O controle de missão (Terra) analisa os gráficos de temperatura e umidade dos compartimentos. O polling de 5 segundos garante dados frescos para qualquer decisão.',
  },
  {
    hora: '14:00',
    title: 'Análise Preditiva Semanal',
    desc: 'Uma vez por semana, o analista de missão dispara a análise preditiva via IA. O Claude gera um relatório com projeções das próximas 12 horas e recomendações.',
  },
  {
    hora: '18:00',
    title: 'Registro de Uso de Equipamentos',
    desc: 'Itens científicos e ferramentas utilizados durante as atividades do dia são registrados. O sistema identifica categorias com consumo acima do esperado.',
  },
  {
    hora: '22:00',
    title: 'Revisão de Fim de Dia',
    desc: 'Antes de dormir, o astronauta confere o resumo do dia e descarta alertas já resolvidos. Itens com status "crítico" são sinalizados para atenção prioritária amanhã.',
  },
]

const Aplicacao = () => (
  <div className="page">
    <div className="page-hero">
      <span className="page-tag">Uso Real</span>
      <h1>Aplicação no Dia a Dia</h1>
      <p>
        Veja como o OrbitStock se integra à rotina operacional de astronautas e
        equipes de controle de missão, do momento em que acordam até o final do dia.
      </p>
    </div>

    <div className="page-highlight">
      Uma missão Dragon típica dura <strong>6 a 8 meses</strong>. Durante esse período,
      a tripulação realiza centenas de registros de consumo e a equipe de missão
      monitora milhares de pontos de telemetria — tudo gerenciado pelo OrbitStock.
    </div>

    <p className="page-section-title">Rotina típica de missão</p>
    <div className="page-steps">
      {ROTINA.map(({ hora, title, desc }) => (
        <div key={hora} className="page-step">
          <div className="page-step-num" style={{ width: 52, borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
            {hora}
          </div>
          <div className="page-step-body">
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        </div>
      ))}
    </div>

    <p className="page-section-title">Perfis de uso</p>
    <div className="page-grid">
      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#eff6ff' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de astronauta">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Astronauta de Bordo</h3>
        <p>
          Usa o <strong>App de Inventário</strong> (tela escura de tablet) para registrar
          consumo, filtrar itens por categoria e resolver alertas ativos. Acesso rápido
          mesmo em condições de microgravidade.
        </p>
      </div>
      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#f0fdf4' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de analista">
            <path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Analista de Missão (Terra)</h3>
        <p>
          Monitora o <strong>Dashboard de Controle</strong> com KPIs da frota, gráficos
          de telemetria e alertas em tempo real. Gera análises preditivas semanais e
          planeja próximos reabastecimentos.
        </p>
      </div>
      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#fdf4ff' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de diretor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Diretor de Operações</h3>
        <p>
          Consulta relatórios de risco gerados pela IA para tomar decisões estratégicas
          sobre reabastecimentos, alteração de missões ou ajuste de cargas em futuras
          partidas.
        </p>
      </div>
    </div>

    <p className="page-section-title">Fluxo de alertas</p>
    <div className="page-stats">
      <div className="page-stat">
        <div className="page-stat-value" style={{ color: '#f59e0b' }}>Aviso</div>
        <div className="page-stat-label">estoque entre 25% e 50%</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value" style={{ color: '#dc2626' }}>Crítico</div>
        <div className="page-stat-label">estoque abaixo de 25%</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value" style={{ color: '#9333ea' }}>Preditivo</div>
        <div className="page-stat-label">IA projeta esgotamento em &lt;12h</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value" style={{ color: '#16a34a' }}>Resolvido</div>
        <div className="page-stat-label">tripulação confirmou ação corretiva</div>
      </div>
    </div>
  </div>
)

export default Aplicacao
