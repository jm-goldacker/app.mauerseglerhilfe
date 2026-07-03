import Keycloak from 'keycloak-js'

const env = (window as Window & { __ENV__?: Record<string, string> }).__ENV__ ?? {}

const keycloak = new Keycloak({
  url: env.KEYCLOAK_URL ?? import.meta.env.VITE_KEYCLOAK_URL ?? 'http://localhost:8090/auth',
  realm: env.KEYCLOAK_REALM ?? import.meta.env.VITE_KEYCLOAK_REALM ?? 'master',
  clientId: env.KEYCLOAK_CLIENT_ID ?? import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'mauerseglerhilfe-app',
})

export function hasRole(role: string): boolean {
  // realm_access kann je nach Keycloak-Konfiguration als { roles: [...] }
  // ODER als flaches Array ankommen - beide Formen unterstützen (das Backend
  // tut dasselbe im KeycloakClaimsTransformer). Der Array-Zweig wurde einmal
  // als "tot" entfernt und hat Managern real die Rechte genommen.
  const realmAccess = keycloak.realmAccess as unknown
  if (Array.isArray(realmAccess)) {
    return (realmAccess as string[]).includes(role)
  }
  return (realmAccess as { roles?: string[] } | undefined)?.roles?.includes(role) ?? false
}

export default keycloak
