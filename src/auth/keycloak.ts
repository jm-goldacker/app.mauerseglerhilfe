import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: 'http://localhost:8090/auth',
  realm: 'master',
  clientId: 'mauerseglerhilfe-app',
})

export default keycloak
