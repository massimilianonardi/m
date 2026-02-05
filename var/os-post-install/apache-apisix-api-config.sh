#!/bin/sh

export APISIX_KEY="knpgKvNuusqgtxbsIhPuqGWEBWpDJwHg"
export APISIX_HOST="auth-proxy.rpr-spa.it"
export APISIX_PORT="9443"

export KEYCLOAK_HOST="auth-keycloak.rpr-spa.it"
export KEYCLOAK_PORT="8443"
export KEYCLOAK_REALM="rpr"
export KEYCLOAK_CLIENT_ID="apache-apisix"
export KEYCLOAK_CLIENT_SECRET="WiLDWAtS9FMMjSzAP7fElIzvHn9ftrTU"
export KEYCLOAK_PROTECTED_URI="auth"



# ssl
curl -i "http://127.0.0.1:9180/apisix/admin/ssls?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "apisix-ssl",
  "type": "server",
  "status": 1,
  "sni": "'"${APISIX_HOST}"'",
  "cert": "'"$(cat "/m/certs/rpr-spa.pem")"'",
  "key": "'"$(cat "/m/certs/rpr-spa.key")"'",
  "ssl_protocols": ["TLSv1.2", "TLSv1.3"]
}'



# upstreams
curl -i "http://127.0.0.1:9180/apisix/admin/upstreams?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "httpbin.org-http-upstream",
  "name": "httpbin.org http upstream",
  "scheme": "http",
  "retries": 1,
  "type": "roundrobin",
  "nodes":
  {
    "httpbin.org:80": 1
  }
}'

curl -i "http://127.0.0.1:9180/apisix/admin/upstreams?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "httpbin.org-https-upstream",
  "name": "httpbin.org https upstream",
  "scheme": "https",
  "retries": 1,
  "type": "roundrobin",
  "nodes":
  {
    "httpbin.org:443": 1
  }
}'



# services
curl -i "http://127.0.0.1:9180/apisix/admin/services?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "httpbin.org-http-service",
  "name": "httpbin.org http service",
  "upstream_id": "httpbin.org-http-upstream"
}'

curl -i "http://127.0.0.1:9180/apisix/admin/services?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "httpbin.org-https-service",
  "name": "httpbin.org https service",
  "upstream_id": "httpbin.org-https-upstream"
}'



# route auth authz-keycloak keycloak
curl -i "http://127.0.0.1:9180/apisix/admin/routes?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "route-auth",
  "uri":"/'"${KEYCLOAK_PROTECTED_URI}"'/*",
  "plugins":
  {
    "authz-keycloak":
    {
      "client_id": "'"${KEYCLOAK_CLIENT_ID}"'",
      "client_secret": "'"${KEYCLOAK_CLIENT_SECRET}"'",
      "discovery": "https://'"${KEYCLOAK_HOST}"':'"${KEYCLOAK_PORT}"'/realms/'"${KEYCLOAK_REALM}"'/.well-known/uma2-configuration",
      "policy_enforcement_mode": "ENFORCING",
      "permissions": ["read", "write"],
      "lazy_load_paths": false,
      "http_method_as_scope": false,
      "ssl_verify": true
    },
    "proxy-rewrite":
    {
      "regex_uri": ["^/(.*)/(.*)", "/$2"]
    }
  },
  "service_id": "httpbin.org-https-service"
}'



# route auth authz-keycloak keycloak
curl -i "http://127.0.0.1:9180/apisix/admin/routes?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "route-auth",
  "uri":"/'"${KEYCLOAK_PROTECTED_URI}"'/*",
  "plugins":
  {
    "openid-connect":
    {
      "bearer_only": false,
      "session":
      {
        "secret": "change_to_whatever_secret_you_want"
      },
      "use_pkce": true,
      "client_id": "'"${KEYCLOAK_CLIENT_ID}"'",
      "client_secret": "'"${KEYCLOAK_CLIENT_SECRET}"'",
      "discovery": "https://'"${KEYCLOAK_HOST}"':'"${KEYCLOAK_PORT}"'/realms/'"${KEYCLOAK_REALM}"'/.well-known/openid-configuration",
      "scope": "openid profile",
      "redirect_uri": "https://'"${APISIX_HOST}"':'"${APISIX_PORT}"'/'"${KEYCLOAK_PROTECTED_URI}"'/callback"
    },
    "authz-keycloak":
    {
      "client_id": "'"${KEYCLOAK_CLIENT_ID}"'",
      "client_secret": "'"${KEYCLOAK_CLIENT_SECRET}"'",
      "discovery": "https://'"${KEYCLOAK_HOST}"':'"${KEYCLOAK_PORT}"'/realms/'"${KEYCLOAK_REALM}"'/.well-known/uma2-configuration",
      "policy_enforcement_mode": "ENFORCING",
      "permissions": ["read", "write"],
      "lazy_load_paths": false,
      "http_method_as_scope": false,
      "ssl_verify": true
    },
    "proxy-rewrite":
    {
      "regex_uri": ["^/(.*)/(.*)", "/$2"]
    }
  },
  "service_id": "httpbin.org-https-service"
}'

curl "https://${KEYCLOAK_HOST}:${KEYCLOAK_PORT}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token" \
  -d "client_id=${KEYCLOAK_CLIENT_ID}" \
  -d "client_secret=${KEYCLOAK_CLIENT_SECRET}" \
  -d "grant_type=client_credentials"

curl http://127.0.0.1:9080/auth/ip -H "Authorization: Bearer ${ACCESS_TOKEN}"



# route auth openid-connect keycloak
curl -i "http://127.0.0.1:9180/apisix/admin/routes?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "route-auth",
  "uri":"/'"${KEYCLOAK_PROTECTED_URI}"'/*",
  "plugins":
  {
    "openid-connect":
    {
      "bearer_only": false,
      "session":
      {
        "secret": "change_to_whatever_secret_you_want"
      },
      "use_pkce": true,
      "client_id": "'"${KEYCLOAK_CLIENT_ID}"'",
      "client_secret": "'"${KEYCLOAK_CLIENT_SECRET}"'",
      "discovery": "https://'"${KEYCLOAK_HOST}"':'"${KEYCLOAK_PORT}"'/realms/'"${KEYCLOAK_REALM}"'/.well-known/openid-configuration",
      "scope": "openid profile",
      "redirect_uri": "https://'"${APISIX_HOST}"':'"${APISIX_PORT}"'/'"${KEYCLOAK_PROTECTED_URI}"'/callback"
    },
    "proxy-rewrite":
    {
      "regex_uri": ["^/(.*)/(.*)", "/$2"]
    }
  },
  "service_id": "httpbin.org-https-service"
}'



# route pub
curl -i "http://127.0.0.1:9180/apisix/admin/routes?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "route-pub",
  "uri":"/pub/*",
  "plugins":
  {
    "proxy-rewrite":
    {
      "regex_uri": ["^/(.*)/(.*)", "/$2"]
    }
  },
  "service_id": "httpbin.org-https-service"
}'



#-------------------------------------------------------------------------------
# auth test

export APISIX_KEY="knpgKvNuusqgtxbsIhPuqGWEBWpDJwHg"
export APISIX_HOST="dev.rpr-spa.it"
export APISIX_PORT="9443"

export KEYCLOAK_HOST="auth-keycloak.rpr-spa.it"
export KEYCLOAK_PORT="8443"
export KEYCLOAK_REALM="rpr"
export KEYCLOAK_CLIENT_ID="apache-apisix-authz"
export KEYCLOAK_CLIENT_SECRET="TkKZ5GXRqGPdYG6Ok8E9FtNHTo6aao3A"
export KEYCLOAK_PROTECTED_URI="authz"

export OIDC_CLIENT_ID="$KEYCLOAK_CLIENT_ID"
export OIDC_CLIENT_SECRET="$KEYCLOAK_CLIENT_SECRET"

curl -i "http://$KEYCLOAK_HOST:$KEYCLOAK_PORT/realms/$KEYCLOAK_REALM/protocol/openid-connect/token" -X POST \
  -d 'grant_type=client_credentials' \
  -d 'client_id='$KEYCLOAK_CLIENT_ID'' \
  -d 'client_secret='$KEYCLOAK_CLIENT_SECRET''

export ACCESS_TOKEN="eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3MDlhOTViMy1mNjA3LTRiN2YtOTYyOC1iOGI0MDhmZGMxZDEifQ.eyJleHAiOjAsImlhdCI6MTc2MjM1MTMwNiwianRpIjoiM2MzNzY3YTQtMTFjMS0wZDZjLTc3ZDYtZjFlNThiNzliNGEzIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLWtleWNsb2FrLnJwci1zcGEuaXQ6ODQ0My9yZWFsbXMvcnByIiwiYXVkIjoiaHR0cHM6Ly9hdXRoLWtleWNsb2FrLnJwci1zcGEuaXQ6ODQ0My9yZWFsbXMvcnByIiwidHlwIjoiUmVnaXN0cmF0aW9uQWNjZXNzVG9rZW4iLCJyZWdpc3RyYXRpb25fYXV0aCI6ImF1dGhlbnRpY2F0ZWQifQ.Mm1DIQECpKR8Hpq5bRZ9rMF1HZ6sMU0yHkn7E6B-NLJMLxyrR2SNIE_CgEshVKxVhmmPLSKKwyDW7eM4M9GiiQ"

curl "http://127.0.0.1:9180/apisix/admin/routes" -X PUT \
  -H "X-API-KEY: ${APISIX_KEY}" \
  -d '{
    "id": "authz-keycloak-route",
    "uri": "/anything",
    "plugins": {
      "authz-keycloak": {
        "lazy_load_paths": true,
        "resource_registration_endpoint": "https://'"$KEYCLOAK_HOST"':'"${KEYCLOAK_PORT}"'/realms/'"${KEYCLOAK_REALM}"'/authz/protection/resource_set",
        "discovery": "https://'"${KEYCLOAK_HOST}"':'"${KEYCLOAK_PORT}"'/realms/'"${KEYCLOAK_REALM}"'/.well-known/uma2-configuration",
        "client_id": "'"$KEYCLOAK_CLIENT_ID"'",
        "client_secret": "'"$KEYCLOAK_CLIENT_SECRET"'"
      }
    },
    "upstream": {
      "type": "roundrobin",
      "nodes": {
        "httpbin.org": 1
      }
    }
  }'

curl "http://127.0.0.1:9080/anything" -H "Authorization: Bearer $ACCESS_TOKEN"
