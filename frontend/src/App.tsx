import { useState } from 'react'
import './components/dashboard.css'
import Dashboard from './components/Dashboard'
import PredictionView from './components/PredictionView'
import AstronautApp from './components/AstronautApp'

type View = 'dashboard' | 'prediction' | 'astronaut'

function App() {
  const [view, setView] = useState<View>('dashboard')

  function onNavigate(item: string) {
    if (item === 'Dashboard') setView('dashboard')
    else if (item === 'Previsão IA') setView('prediction')
    else if (item === 'Inventário') setView('astronaut')
    // demais itens ainda não implementados
  }

  if (view === 'prediction') return <PredictionView onNavigate={onNavigate} />
  if (view === 'astronaut') return <AstronautApp onNavigate={onNavigate} />
  return <Dashboard onNavigate={onNavigate} />
}

export default App
