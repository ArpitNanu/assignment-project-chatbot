import { useState, useEffect } from 'react'

function App() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simple fetch to check backend connectivity
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => {
        setHealth(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Backend not reachable:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="app-container">
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Letter<span style={{ color: 'var(--primary)' }}>Alchemy</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
          Modern, modular, and premium AI Chatbot experience.
        </p>
      </header>

      <main>
        <div className="glass-card">
          <h2 style={{ marginBottom: '1rem' }}>Backend Connectivity</h2>
          {loading ? (
            <p>Checking server status...</p>
          ) : health ? (
            <div>
              <p style={{ color: '#4ade80', fontWeight: 'bold' }}>✓ {health.message}</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Server Timestamp: {health.timestamp}
              </p>
            </div>
          ) : (
            <p style={{ color: '#f87171' }}>✗ Could not connect to backend (is it running on port 5000?)</p>
          )}
          
          <div style={{ marginTop: '2rem' }}>
            <button className="btn-primary">Get Started</button>
          </div>
        </div>
      </main>

      <footer style={{ marginTop: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>&copy; 2024 LetterAlchemy. Built with Passion.</p>
      </footer>
    </div>
  )
}

export default App
