#!/bin/sh
escape_js() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

cat > /usr/share/nginx/html/env.js << EOF
window.__ENV__ = {
  KEYCLOAK_URL: "$(escape_js "${KEYCLOAK_URL}")",
  KEYCLOAK_REALM: "$(escape_js "${KEYCLOAK_REALM:-master}")",
  KEYCLOAK_CLIENT_ID: "$(escape_js "${KEYCLOAK_CLIENT_ID:-mauerseglerhilfe-app}")",
  API_URL: "$(escape_js "${API_URL}")",
};
EOF
exec nginx -g 'daemon off;'
