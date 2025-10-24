import Keycloak, { KeycloakConfig } from "keycloak-js";

const keycloakConfig: KeycloakConfig = {
  url: process.env.KEYCLOAK_ISSUER ?? "",
  realm: "mauersegler-realm",
  clientId: process.env.KEYCLOAK_CLIENT_ID!,
};

export const keycloak = new Keycloak(keycloakConfig);
