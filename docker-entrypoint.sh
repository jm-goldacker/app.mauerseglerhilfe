#!/bin/sh
escape_js() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

# Scheme + Host (+Port) einer URL extrahieren, z. B. https://api.example.org
origin_of() {
  printf '%s' "$1" | sed -E 's#^(https?://[^/]+).*#\1#'
}

cat > /usr/share/nginx/html/env.js << EOF
window.__ENV__ = {
  KEYCLOAK_URL: "$(escape_js "${KEYCLOAK_URL}")",
  KEYCLOAK_REALM: "$(escape_js "${KEYCLOAK_REALM:-master}")",
  KEYCLOAK_CLIENT_ID: "$(escape_js "${KEYCLOAK_CLIENT_ID:-mauerseglerhilfe-app}")",
  API_URL: "$(escape_js "${API_URL}")",
};
EOF

# connect-src der CSP aus den konfigurierten URLs ableiten, damit die App auf
# beliebigen Deployments funktioniert statt nur auf hartcodierten Hosts
CONNECT_SRC="'self'"
[ -n "${API_URL}" ] && CONNECT_SRC="$CONNECT_SRC $(origin_of "${API_URL}")"
[ -n "${KEYCLOAK_URL}" ] && CONNECT_SRC="$CONNECT_SRC $(origin_of "${KEYCLOAK_URL}")"
sed -i "s#__CONNECT_SRC__#${CONNECT_SRC}#g" /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
