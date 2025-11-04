#!/bin/sh

# amd64
wget -O - http://repos.apiseven.com/pubkey.gpg | sudo apt-key add -
echo "deb http://repos.apiseven.com/packages/debian bullseye main" | sudo tee /etc/apt/sources.list.d/apisix.list

# arm64
#wget -O - http://repos.apiseven.com/pubkey.gpg | sudo apt-key add -
#echo "deb http://repos.apiseven.com/packages/arm64/debian bullseye main" | sudo tee /etc/apt/sources.list.d/apisix.list

sudo apt update
sudo apt install -y apisix

sudo apisix init

sudo nano /usr/local/apisix/conf/config.yaml

sudo apisix start
# sudo apisix start --config "/usr/local/apisix/conf/config.yaml"
#sudo apisix stop
#sudo apisix help
#systemctl start apisix
#systemctl stop apisix

systemctl list-unit-files --state=enabled
systemctl list-unit-files --state=running

# validate
curl "http://127.0.0.1:9080" --head | grep Server



. /etc/environment.d/99-m-paths.conf
export PATH="/m/bin:$PATH"

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
