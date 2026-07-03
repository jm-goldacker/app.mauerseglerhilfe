import Keycloak from 'keycloak-js'

const env = (window as Window & { __ENV__?: Record<string, string> }).__ENV__ ?? {}

const keycloak = new Keycloak({
  url: env.KEYCLOAK_URL ?? import.meta.env.VITE_KEYCLOAK_URL ?? 'http://localhost:8090/auth',
  realm: env.KEYCLOAK_REALM ?? import.meta.env.VITE_KEYCLOAK_REALM ?? 'master',
  clientId: env.KEYCLOAK_CLIENT_ID ?? import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'mauerseglerhilfe-app',
})

export function hasRole(role: string): boolean {
  return keycloak.realmAccess?.roles?.includes(role) ?? false
}

export default keycloak
