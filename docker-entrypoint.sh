#!/bin/sh
cat > /usr/share/nginx/html/env.js << EOF
window.__ENV__ = {
  KEYCLOAK_URL: '${KEYCLOAK_URL}',
  KEYCLOAK_REALM: '${KEYCLOAK_REALM:-master}',
  KEYCLOAK_CLIENT_ID: '${KEYCLOAK_CLIENT_ID:-mauerseglerhilfe-app}',
  API_URL: '${API_URL}',
};
EOF
exec nginx -g 'daemon off;'
