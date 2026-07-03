import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import keycloak from './auth/keycloak.ts'

const root = createRoot(document.getElementById('root')!)

function renderAuthError(message: string) {
  root.render(
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16, fontFamily: 'system-ui, sans-serif', padding: 24, textAlign: 'center' }}>
      <h1 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a' }}>Anmeldung nicht möglich</h1>
      <p style={{ fontSize: 14, color: '#64748b', maxWidth: 420 }}>{message}</p>
      <button
        onClick={() => { sessionStorage.removeItem('kc-reload-attempts'); window.location.reload() }}
        style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: 'hsl(205, 100%, 35%)', color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
      >
        Erneut versuchen
      </button>
    </div>,
  )
}

keycloak
  .init({
    onLoad: 'login-required',
    checkLoginIframe: false,
  })
  .then((authenticated) => {
    if (!authenticated) {
      // Sollte mit login-required kaum eintreten. Reload begrenzen, damit ein
      // hartnäckig unauthentifizierter Zustand keine Endlosschleife erzeugt.
      const attempts = Number(sessionStorage.getItem('kc-reload-attempts') ?? '0')
      if (attempts >= 2) {
        renderAuthError('Die Anmeldung konnte nicht abgeschlossen werden.')
        return
      }
      sessionStorage.setItem('kc-reload-attempts', String(attempts + 1))
      window.location.reload()
      return
    }
    sessionStorage.removeItem('kc-reload-attempts')
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
  .catch((err) => {
    // Ohne Fallback bliebe die Seite bei nicht erreichbarem Keycloak einfach weiß
    console.error('Keycloak-Initialisierung fehlgeschlagen:', err)
    renderAuthError('Der Anmeldedienst ist derzeit nicht erreichbar. Bitte später erneut versuchen.')
  })
