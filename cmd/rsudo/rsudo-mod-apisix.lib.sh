#!/bin/sh

. log.lib.sh

APISIX_ADMIN_URL="http://127.0.0.1:9180/apisix/admin"

KEYCLOAK_CLIENT_ID_AUTHN_AUTHZ="apisix-authn-authz"
KEYCLOAK_CLIENT_SECRET="WiLDWAtS9FMMjSzAP7fElIzvHn9ftrTU"

export PROXY_HOST="apps.rpr-spa.it"

export APISIX_HOST="apisix.rpr-spa.it"
export APISIX_PORT="9443"

export KEYCLOAK_HOST="keycloak.rpr-spa.it"
export KEYCLOAK_PORT="8443"
export KEYCLOAK_REALM="rpr"

export KEYCLOAK_REALM_URL="https://${KEYCLOAK_HOST}:${KEYCLOAK_PORT}/realms/${KEYCLOAK_REALM}"

export AUTHN_DISCOVERY_URL="${KEYCLOAK_REALM_URL}/.well-known/openid-configuration"
export AUTHZ_DISCOVERY_URL="${KEYCLOAK_REALM_URL}/.well-known/uma2-configuration"

export AUTHN_REDIRECT_BASE_URL="https://${APISIX_HOST}:${APISIX_PORT}"
#export AUTHN_REDIRECT_BASE_URL="https://${PROXY_HOST}/apisix"

# url_host, url_command, key, url_param -> url_param will be splitted in more params by specific api

#------------------------------------------------------------------------------

rsudo_mod_apisix_test()
{
  log_debug "inside apisix"
  rsudo << 'EOF'
ADMIN_KEY_PREFIX="$(cat "/usr/local/apisix/conf/config.yaml" | sed -n "s/admin_key:.*//p")"
ADMIN_KEY="$(cat "/usr/local/apisix/conf/config.yaml" | sed "s/$ADMIN_KEY_PREFIX//" | sed -n '/admin_key:/,/^[[:lower:]]/{//!p;}' | tr '\n' '|' | sed -e 's/ //g' -e 's/.*admin|//' -e 's/|.*//' -e 's/key://')"

echo "ADMIN_KEY_PREFIX='$ADMIN_KEY_PREFIX'"
echo "ADMIN_KEY='$ADMIN_KEY'"
EOF
}

#-------------------------------------------------------------------------------

rsudo_mod_apisix_key()
{
  rsudo << 'EOF'
ADMIN_KEY_PREFIX="$(cat "/usr/local/apisix/conf/config.yaml" | sed -n "s/admin_key:.*//p")"
ADMIN_KEY="$(cat "/usr/local/apisix/conf/config.yaml" | sed "s/$ADMIN_KEY_PREFIX//" | sed -n '/admin_key:/,/^[[:lower:]]/{//!p;}' | tr '\n' '|' | sed -e 's/ //g' -e 's/.*admin|//' -e 's/|.*//' -e 's/key://')"
echo "$ADMIN_KEY"
EOF
}

rsudo_mod_apisix_keyset()
{
  if [ -z "$1" ]
  then
    log_debug "apisix_key_set: empty arg"
    return 1
  fi

  eval "$1=\"\$(rsudo_mod_apisix_key)\""
}

#-------------------------------------------------------------------------------

rsudo_mod_apisix_command()
{
  if [ -z "$1" ] || [ -z "$2" ]
  then
    return 1
  fi

  rsudo << EOF
curl -i "${APISIX_ADMIN_URL}/${1}?api_key=${APISIX_KEY}" -X PUT -d '${2}'
EOF

}

#-------------------------------------------------------------------------------
