#!/bin/sh

. log.lib.sh

#------------------------------------------------------------------------------

KEYCLOAK_CMD="/m/bin/keycloak"
KEYCLOAK_ADMIN_CMD="/m/bin/kcadm"
KEYCLOAK_REG_CMD="/m/bin/kcreg"

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
  if [ -n "$1" ]
  then
    KEYCLOAK_USER_NAME="$1"
    shift
  fi

  if [ -n "$1" ]
  then
    KEYCLOAK_USER_PASS="$1"
    shift
  fi

  if [ -z "$KEYCLOAK_USER_NAME" ] || [ -z "$KEYCLOAK_USER_PASS" ]
  then
    log_debug "rsudo_mod_keycloak_access_token: empty credentials"
    return 1
  fi

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

  eval $1='"$(shift; rsudo_mod_keycloak_access_token "$@")"'
}

#-------------------------------------------------------------------------------

rsudo_mod_keycloak_api()
{

  if [ -z "$ACCESS_TOKEN" ]
  then
    ACCESS_TOKEN="$(rsudo_mod_keycloak_access_token)"
  fi

(
  if [ -z "$1" ]
  then
    exit 1
  fi

  if [ -z "$KEYCLOAK_ADMIN_REALM_URL" ]
  then
    retun 1
  fi

  if [ -z "$2" ]
  then
    HTTP_METHOD="GET"
  else
    HTTP_METHOD="$2"
  fi

  if [ -z "$3" ]
  then
    curl -i "${KEYCLOAK_ADMIN_REALM_URL}/${1}" -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "Content-Type: application/json" -X ${HTTP_METHOD} -d "scope=openid email profile"
  else
    curl -i "${KEYCLOAK_ADMIN_REALM_URL}/${1}" -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "Content-Type: application/json" -X ${HTTP_METHOD} -d "scope=openid email profile" -d "${3}"
  fi
)
}

rsudo_mod_keycloak_api()
{

  if [ -z "$ACCESS_TOKEN" ]
  then
    ACCESS_TOKEN="$(rsudo_mod_keycloak_access_token)"
  fi

(
  if [ -z "$1" ]
  then
    exit 1
  fi

  if [ -z "$KEYCLOAK_ADMIN_REALM_URL" ]
  then
    retun 1
  fi

  if [ -z "$2" ]
  then
    HTTP_METHOD="GET"
  else
    HTTP_METHOD="$2"
  fi

  if [ -z "$3" ]
  then
    rsudo << EOF
curl -s "${KEYCLOAK_ADMIN_REALM_URL}/${1}" -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "Content-Type: application/json" -X ${HTTP_METHOD} -d "scope=openid email profile"
EOF
  else
    rsudo << EOF
curl -s "${KEYCLOAK_ADMIN_REALM_URL}/${1}" -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "Content-Type: application/json" -X ${HTTP_METHOD} -d "scope=openid email profile" -d '${3}'
EOF
  fi
)
}

#-------------------------------------------------------------------------------

rsudo_mod_keycloak_get()
{
  rsudo_mod_keycloak_api "$1" "GET"
}

#-------------------------------------------------------------------------------

rsudo_mod_keycloak_put()
{
  rsudo_mod_keycloak_api "$1" "PUT" "$2"
}

#-------------------------------------------------------------------------------

rsudo_mod_keycloak_post()
{
  rsudo_mod_keycloak_api "$1" "POST" "$2"
}

#-------------------------------------------------------------------------------

rsudo_mod_keycloak_del()
{
  rsudo_mod_keycloak_api "$1" "DELETE"
}

#-------------------------------------------------------------------------------

rsudo_mod_keycloak_delete()
{
  rsudo_mod_keycloak_delete_"$@"
}

#-------------------------------------------------------------------------------

rsudo_mod_keycloak_delete_client()
{
  rsudo_mod_keycloak_del "clients/${1}"
}

#-------------------------------------------------------------------------------

rsudo_mod_keycloak_create()
{
  rsudo_mod_keycloak_create_"$@"
}

#-------------------------------------------------------------------------------

rsudo_mod_keycloak_create_client()
{
  # "$KEYCLOAK_ADMIN_CMD" create clients -r "$KEYCLOAK_REALM" -f ZZZ

  rsudo_mod_keycloak_post "clients/$1" "$2"
}

#-------------------------------------------------------------------------------

rsudo_mod_keycloak_get___()
{
  rsudo_mod_keycloak_get_"$@"
}

#-------------------------------------------------------------------------------

rsudo_mod_keycloak_update()
{
  rsudo_mod_keycloak_update_"$@"
}

#-------------------------------------------------------------------------------
