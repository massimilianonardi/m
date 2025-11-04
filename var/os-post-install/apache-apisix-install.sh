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

# validate
curl "http://127.0.0.1:9080" --head | grep Server



. /etc/environment.d/99-m-paths.conf
export PATH="/m/bin:$PATH"
export APISIX_KEY="knpgKvNuusqgtxbsIhPuqGWEBWpDJwHg"



# ssl
curl -i "http://127.0.0.1:9180/apisix/admin/ssls?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "auth-proxy.rpr-spa.it",
  "type": "server",
  "status": 1,
  "sni": "auth-proxy.rpr-spa.it",
  "cert": "'"$(cat "/m/certs/rpr-spa.pem")"'",
  "key": "'"$(cat "/m/certs/rpr-spa.key")"'",
  "ssl_protocols": ["TLSv1.2", "TLSv1.3"]
}'




# plugin_configs openid-connect keycloak
curl -i "http://127.0.0.1:9180/apisix/admin/plugin_configs?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "oidc-keyclaok",
  "name": "oidc keycloak",
  "plugins":
  {
    "openid-connect":
    {
      "client_id": "apache-apisix",
      "client_secret": "WiLDWAtS9FMMjSzAP7fElIzvHn9ftrTU",
      "discovery": "https://auth-keycloak.rpr-spa.it:8443/realms/rpr/.well-known/openid-configuration",
      "redirect_uri": "https://auth-proxy.rpr-spa.it:9443/anything/callback",
      "bearer_only": false,
      "session":
      {
        "secret": "change_to_whatever_secret_you_want"
      },
      "use_pkce": true,
      "scope": "openid profile"
    }
  }
}'



# upstreams
curl -i "http://127.0.0.1:9180/apisix/admin/upstreams?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "test-upstream-http",
  "name": "test upstream http",
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
  "id": "test-upstream-https",
  "name": "test upstream https",
  "scheme": "https",
  "retries": 1,
  "type": "roundrobin",
  "nodes":
  {
    "httpbin.org:443": 1
  }
}'

curl -i "http://127.0.0.1:9180/apisix/admin/upstreams?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "test-upstream-https-keycloak",
  "name": "test upstream https keycloak",
  "scheme": "https",
  "retries": 1,
  "type": "roundrobin",
  "nodes":
  {
    "auth-keycloak.rpr-spa.it:8443": 1
  }
}'

curl -i "http://127.0.0.1:9180/apisix/admin/upstreams?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "test-upstream-https-portale",
  "name": "test upstream https portale",
  "scheme": "https",
  "retries": 1,
  "type": "roundrobin",
  "nodes":
  {
    "portale.rpr-spa.it:443": 1
  }
}'



# route
curl -i "http://127.0.0.1:9180/apisix/admin/routes?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "test-route",
  "uri": "/test",
  "upstream": {
    "type": "roundrobin",
    "nodes": {
      "httpbin.org:80": 1
    }
  }
}'

# route auth
curl -i "http://127.0.0.1:9180/apisix/admin/routes?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "auth-with-oidc",
  "uri":"/anything/*",
  "plugins": {
    "openid-connect": {
      "bearer_only": false,
      "session": {
        "secret": "change_to_whatever_secret_you_want"
      },
      "client_id": "apache-apisix",
      "client_secret": "WiLDWAtS9FMMjSzAP7fElIzvHn9ftrTU",
      "discovery": "https://auth-keycloak.rpr-spa.it:8443/realms/rpr/.well-known/openid-configuration",
      "scope": "openid profile",
      "redirect_uri": "https://auth-proxy.rpr-spa.it:9443/anything/callback"
    }
  },
  "upstream":{
    "type":"roundrobin",
    "nodes":{
      "httpbin.org:80":1
    }
  }
}'

# route auth pkce
curl -i "http://127.0.0.1:9180/apisix/admin/routes?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "auth-with-oidc-pkce",
  "uri":"/anything/*",
  "plugins": {
    "openid-connect": {
      "bearer_only": false,
      "session": {
        "secret": "change_to_whatever_secret_you_want"
      },
      "use_pkce": true,
      "client_id": "apache-apisix",
      "client_secret": "WiLDWAtS9FMMjSzAP7fElIzvHn9ftrTU",
      "discovery": "https://auth-keycloak.rpr-spa.it:8443/realms/rpr/.well-known/openid-configuration",
      "scope": "openid profile",
      "redirect_uri": "https://auth-proxy.rpr-spa.it:9443/anything/callback"
    }
  },
  "upstream":{
    "type":"roundrobin",
    "nodes":{
      "httpbin.org:80":1
    }
  }
}'

# route https
curl -i "http://127.0.0.1:9180/apisix/admin/routes?api_key=$APISIX_KEY" -X PUT -d '
{
  "id": "quickstart-tls-upstream",
  "uri": "/ip",
  "upstream": {
    "scheme": "https",
    "nodes": {
      "httpbin.org:443":1
    },
    "type": "roundrobin"
  }
}'



admin_key=$(yq '.deployment.admin.admin_key[0].key' conf/config.yaml | sed 's/"//g')
APISIX_KEY="admin_key"
curl "http://127.0.0.1:9180/apisix/admin/routes?api_key=$APISIX_KEY" -i

curl http://127.0.0.1:9180/apisix/admin/upstreams/1 \
-H "X-API-KEY: $admin_key" -X PUT -d '
{
    "type": "chash",
    "key": "remote_addr",
    "nodes": {
        "127.0.0.1:80": 1,
        "foo.com:80": 2
    }
}'
