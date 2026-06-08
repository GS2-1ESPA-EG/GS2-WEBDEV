import heroImg from '../assets/hero.png'
import './pages.css'

const Problema = () => (
  <div className="page">
    <div className="page-hero">
      <span className="page-tag">Contexto</span>
      <h1>O Problema</h1>
      <p>
        Missões espaciais de longa duração dependem de suprimentos críticos — alimentos,
        água, medicamentos e oxigênio. Qualquer falha no gerenciamento desses recursos
        pode comprometer a vida dos astronautas e o sucesso da missão.
      </p>
    </div>

    <div className="page-banner">
      <img src={heroImg} alt="Cápsula Dragon SpaceX em órbita terrestre" />
      <span className="page-banner-caption">SpaceX Dragon — missão de abastecimento à ISS</span>
    </div>

    <div className="page-highlight">
      A Estação Espacial Internacional consome cerca de <strong>800 kg de alimentos</strong> e
      <strong> 3.000 litros de água</strong> por astronauta a cada ano. Qualquer desvio não
      detectado pode se tornar crítico em poucas horas.
    </div>

    <p className="page-section-title">Desafios identificados</p>
    <div className="page-grid">
      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#fef2f2' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de alerta">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Escassez Crítica</h3>
        <p>
          Suprimentos mal rastreados podem se esgotar sem aviso prévio, colocando a
          tripulação em risco durante missões de longa duração.
        </p>
      </div>

      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#fffbeb' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de documento">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Rastreabilidade Manual</h3>
        <p>
          O registro manual de consumo é suscetível a erros humanos, inconsistências
          e perda de dados — especialmente em situações de alta demanda operacional.
        </p>
      </div>

      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#f0fdf4' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de gráfico">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Falta de Previsibilidade</h3>
        <p>
          Sem dados históricos e modelos preditivos, é impossível antecipar quando
          um suprimento vai se esgotar antes do reabastecimento planejado.
        </p>
      </div>

      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#eff6ff' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de temperatura">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Condições Ambientais</h3>
        <p>
          Variações de temperatura e umidade nos compartimentos podem deteriorar
          alimentos e medicamentos sem que a tripulação perceba a tempo.
        </p>
      </div>

      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#fdf4ff' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de comunicação">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Comunicação Limitada</h3>
        <p>
          Atrasos de comunicação com a Terra (até 20 minutos em missões a Marte)
          exigem que a tripulação tome decisões autônomas com dados confiáveis.
        </p>
      </div>

      <div className="page-card">
        <div className="page-card-icon" style={{ background: '#fff7ed' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Ícone de custo">
            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Alto Custo de Reabastecimento</h3>
        <p>
          Cada kg enviado ao espaço custa milhares de dólares. Desperdício ou falta
          de suprimentos geram custos enormes e atrasos de missão.
        </p>
      </div>
    </div>

    <p className="page-section-title">Impacto em números</p>
    <div className="page-stats">
      <div className="page-stat">
        <div className="page-stat-value">$54k</div>
        <div className="page-stat-label">custo por kg enviado à ISS</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value">800 kg</div>
        <div className="page-stat-label">alimentos por astronauta/ano</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value">20 min</div>
        <div className="page-stat-label">atraso de sinal Terra–Marte</div>
      </div>
      <div className="page-stat">
        <div className="page-stat-value">6+</div>
        <div className="page-stat-label">meses de missão sem reabastecimento</div>
      </div>
    </div>
  </div>
)

export default Problema
