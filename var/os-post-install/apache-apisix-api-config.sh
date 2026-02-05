#!/bin/sh

export APISIX_KEY="knpgKvNuusqgtxbsIhPuqGWEBWpDJwHg"
export APISIX_HOST="auth-proxy.rpr-spa.it"
export APISIX_PORT="9443"

export KEYCLOAK_HOST="auth-keycloak.rpr-spa.it"
export KEYCLOAK_PORT="8443"
export KEYCLOAK_REALM="rpr"
export KEYCLOAK_CLIENT_ID="apache-apisix"
export KEYCLOAK_CLIENT_SECRET="WiLDWAtS9FMMjSzAP7fElIzvHn9ftrTU"
export KEYCLOAK_PUBLIC_URI="pub"
export KEYCLOAK_AUTHENTICATED_URI="authn"
export KEYCLOAK_AUTHORIZATED_URI="authz"



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



# plugins
curl -i "http://127.0.0.1:9180/apisix/admin/plugin_configs?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "rewrite-plugins",
  "plugins":
  {
    "proxy-rewrite":
    {
      "regex_uri": ["^/(.*)/(.*)", "/$2"]
    }
  }
}'

curl -i "http://127.0.0.1:9180/apisix/admin/plugin_configs?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "rewrite-authn-plugins",
  "plugins":
  {
    "proxy-rewrite":
    {
      "regex_uri": ["^/(.*)/(.*)", "/$2"]
    },
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
      "redirect_uri": "https://'"${APISIX_HOST}"':'"${APISIX_PORT}"'/'"${KEYCLOAK_AUTHENTICATED_URI}"'/callback"
    }
  }
}'

curl -i "http://127.0.0.1:9180/apisix/admin/plugin_configs?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "rewrite-authn-authz-plugins",
  "plugins":
  {
    "proxy-rewrite":
    {
      "regex_uri": ["^/(.*)/(.*)", "/$2"]
    },
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
      "redirect_uri": "https://'"${APISIX_HOST}"':'"${APISIX_PORT}"'/'"${KEYCLOAK_AUTHENTICATED_URI}"'/callback"
    },
    "opa":
    {
      "host": "http://dev.rpr-spa.it:8181",
      "policy": "example1"
    }
  }
}'



# routes
curl -i "http://127.0.0.1:9180/apisix/admin/routes?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "route-pub",
  "uri": "/'"${KEYCLOAK_PUBLIC_URI}"'/*",
  "plugin_config_id": "rewrite-plugins",
  "service_id": "httpbin.org-https-service"
}'



curl -i "http://127.0.0.1:9180/apisix/admin/routes?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "route-authn",
  "uri": "/'"${KEYCLOAK_AUTHENTICATED_URI}"'/*",
  "plugin_config_id": "rewrite-authn-plugins",
  "service_id": "httpbin.org-https-service"
}'



curl -i "http://127.0.0.1:9180/apisix/admin/routes?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "route-authz",
  "uri": "/'"${KEYCLOAK_AUTHORIZATED_URI}"'/*",
  "plugin_config_id": "rewrite-authn-authz-plugins",
  "service_id": "httpbin.org-https-service"
}'



#-------------------------------------------------------------------------------



# route auth authz-keycloak keycloak
curl -i "http://127.0.0.1:9180/apisix/admin/routes?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "route-auth",
  "uri": "/'"${KEYCLOAK_AUTHENTICATED_URI}"'/*",
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
  "id": "route-authz-keycloak",
  "uri": "/'"${KEYCLOAK_AUTHORIZATED_URI}"'/*",
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
      "redirect_uri": "https://'"${APISIX_HOST}"':'"${APISIX_PORT}"'/'"${KEYCLOAK_AUTHENTICATED_URI}"'/callback"
    },
    "authz-keycloak":
    {
      "client_id": "'"${KEYCLOAK_CLIENT_ID}"'",
      "client_secret": "'"${KEYCLOAK_CLIENT_SECRET}"'",
      "discovery": "https://'"${KEYCLOAK_HOST}"':'"${KEYCLOAK_PORT}"'/realms/'"${KEYCLOAK_REALM}"'/.well-known/uma2-configuration",
      "policy_enforcement_mode": "ENFORCING",
      "permissions": ["ip-resource"],
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



#-------------------------------------------------------------------------------
