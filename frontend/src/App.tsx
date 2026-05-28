import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAsk() {
    if (!message.trim()) return
    setLoading(true)
    setReply('')
    try {
      const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      setReply(data.reply)
    } catch (err) {
      setReply('Erro ao chamar a API: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="center">
      <h1>Pergunte ao Claude</h1>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua pergunta..."
        rows={4}
        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
      />

      <button
        type="button"
        onClick={handleAsk}
        disabled={loading}
        style={{ marginTop: '1rem' }}
      >
        {loading ? 'Pensando...' : 'Enviar'}
      </button>

      {reply && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            textAlign: 'left',
          }}
        >
          {reply}
        </div>
      )}
    </section>
  )
}

export default App
