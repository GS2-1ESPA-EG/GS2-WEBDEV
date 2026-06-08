import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './components/dashboard.css'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import PredictionView from './components/PredictionView'
import AstronautApp from './components/AstronautApp'
import Problema from './pages/Problema'
import Tecnologia from './pages/Tecnologia'
import Objetivos from './pages/Objetivos'
import Beneficios from './pages/Beneficios'
import Aplicacao from './pages/Aplicacao'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/problema" replace />} />
          <Route path="problema" element={<Problema />} />
          <Route path="tecnologia" element={<Tecnologia />} />
          <Route path="objetivos" element={<Objetivos />} />
          <Route path="beneficios" element={<Beneficios />} />
          <Route path="aplicacao" element={<Aplicacao />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="predicao" element={<PredictionView />} />
        </Route>
        <Route path="/inventario" element={<AstronautApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
