import keycloak from '../auth/keycloak'

const env = (window as Window & { __ENV__?: Record<string, string> }).__ENV__ ?? {}
const API_BASE = env.API_URL ?? import.meta.env.VITE_API_URL ?? 'http://localhost:5078/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Token erneuern, falls er in den nächsten 30 Sekunden abläuft.
  // Schlägt der Refresh fehl (Session abgelaufen), zum Login umleiten.
  try {
    await keycloak.updateToken(30)
  } catch {
    await keycloak.login()
    throw new Error('Sitzung abgelaufen – bitte erneut anmelden')
  }
  const token = keycloak.token
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (res.status === 401) {
    await keycloak.login()
    throw new Error('Sitzung abgelaufen – bitte erneut anmelden')
  }
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
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
