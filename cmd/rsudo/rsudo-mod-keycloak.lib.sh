#!/bin/sh

. log.lib.sh

#------------------------------------------------------------------------------

rsudo_mod_keycloak_set_auth_vars()
{
  [ -z "$1" ] && return 1; KEYCLOAK_HOST="$1"; shift
  [ -z "$1" ] && return 1; KEYCLOAK_PORT="$1"; shift
  [ -z "$1" ] && return 1; KEYCLOAK_REALM="$1"; shift

  if [ "$KEYCLOAK_PORT" = "443" ]
  then
    KEYCLOAK_REALM_URL="https://${KEYCLOAK_HOST}/realms/${KEYCLOAK_REALM}"
    KEYCLOAK_ADMIN_REALM_URL="https://${KEYCLOAK_HOST}/admin/realms/${KEYCLOAK_REALM}"
  else
    KEYCLOAK_REALM_URL="https://${KEYCLOAK_HOST}:${KEYCLOAK_PORT}/realms/${KEYCLOAK_REALM}"
    KEYCLOAK_ADMIN_REALM_URL="https://${KEYCLOAK_HOST}:${KEYCLOAK_PORT}/admin/realms/${KEYCLOAK_REALM}"
  fi

  KEYCLOAK_AUTHN_DISCOVERY_URL="${KEYCLOAK_REALM_URL}/.well-known/openid-configuration"
  KEYCLOAK_AUTHZ_DISCOVERY_URL="${KEYCLOAK_REALM_URL}/.well-known/uma2-configuration"
}

#-------------------------------------------------------------------------------

rsudo_mod_keycloak_access_token()
{
  curl "https://${KEYCLOAK_HOST}:${KEYCLOAK_PORT}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token" \
    -d "client_id=admin-cli" \
    -d "username=${KEYCLOAK_USER_NAME}" \
    -d "password=${KEYCLOAK_USER_PASS}" \
    -d "grant_type=password" \
    -d "scope=openid email profile" \
  | sed -e 's/^.*access_token":"//g' -e 's/",".*//g'
}

rsudo_mod_keycloak_access_token_set()
{
  if [ -z "$1" ]
  then
    log_debug "keycloak_access_token_set: empty arg"
    return 1
  fi

  eval "$1=\"\$(rsudo_mod_keycloak_access_token)\""
}

#-------------------------------------------------------------------------------

# keycloak

true
