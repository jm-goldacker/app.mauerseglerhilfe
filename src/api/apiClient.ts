import keycloak from '../auth/keycloak'

const env = (window as Window & { __ENV__?: Record<string, string> }).__ENV__ ?? {}
const API_BASE = env.API_URL ?? import.meta.env.VITE_API_URL ?? 'http://localhost:5078/api'

// Fehlertext aus einer Antwort ableiten: ProblemDetails/Validierungsfehler
// lesbar machen; rohe HTML-/Stacktrace-Antworten nicht in die Oberfläche kippen.
async function errorMessage(res: Response): Promise<string> {
  const contentType = res.headers.get('content-type') ?? ''
  const text = await res.text()

  if (contentType.includes('json')) {
    try {
      const data: unknown = JSON.parse(text)
      if (data && typeof data === 'object') {
        // ASP.NET ValidationProblemDetails: { title, errors: { Feld: [Meldungen] } }
        const problem = data as { title?: string; errors?: Record<string, string[]> }
        if (problem.errors && typeof problem.errors === 'object') {
          const details = Object.values(problem.errors).flat().join(' ')
          if (details) return details
        }
        if (typeof problem.title === 'string') return problem.title
      }
    } catch {
      // kein valides JSON - unten generisch behandeln
    }
  }
  // Kurze Klartext-Antworten (z. B. „... nicht gefunden", „... existiert
  // bereits") durchreichen, alles andere generisch halten
  if (text && text.length <= 300 && !text.trimStart().startsWith('<')) return text
  return `Fehler ${res.status}`
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isMutation = !!options.method && options.method !== 'GET'

  // Token erneuern, falls er in den nächsten 30 Sekunden abläuft.
  try {
    await keycloak.updateToken(30)
  } catch {
    // Bei Mutationen NICHT hart zum Login umleiten - der Redirect würde alle
    // Formulareingaben verwerfen. Fehlermeldung anzeigen und dem Nutzer die
    // Entscheidung lassen.
    if (isMutation) {
      throw new Error('Sitzung abgelaufen. Eingaben ggf. kopieren und die Seite neu laden, um sich erneut anzumelden.')
    }
    await keycloak.login()
    throw new Error('Sitzung abgelaufen – bitte erneut anmelden')
  }

  const token = keycloak.token
  const headers: HeadersInit = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch {
    throw new Error('Server nicht erreichbar – bitte Verbindung prüfen')
  }

  if (res.status === 401) {
    // updateToken war unmittelbar zuvor erfolgreich - der Server lehnt also ein
    // frisches Token ab (z. B. Audience-/Rollen-Konfiguration). Ein Login-Redirect
    // würde hier in einer Endlosschleife enden, weil die SSO-Session den Nutzer
    // still wieder anmeldet und der nächste Request erneut 401 liefert.
    throw new Error(
      isMutation
        ? 'Anmeldung vom Server abgelehnt. Eingaben ggf. kopieren und die Seite neu laden.'
        : 'Anmeldung vom Server abgelehnt – bitte Seite neu laden oder Administrator kontaktieren.',
    )
  }
  if (!res.ok) {
    throw new Error(await errorMessage(res))
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: unknown) =>
    request<void>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
}
