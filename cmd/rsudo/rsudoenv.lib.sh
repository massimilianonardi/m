#!/bin/sh

. log.lib.sh
. env.lib.sh
. enc.lib.sh

#------------------------------------------------------------------------------

rsudoenv()
{
  # "rsudoenv_${1}" "$@"
  rsudoenv_"$@"
}

rsudoenv_load()
{
  log_echo "rsudoenv_load '$1'"
  encoded_file_import "$1"
}

rsudoenv_save()
{
  log_debug "$(echo "rsudoenv_save RSUDO_ENV:"; env_return export $(env_list "RSUDO_ENV"))"

  log_echo "rsudoenv_save '$1'"
  echo "$(env_return export $(env_list "RSUDO_ENV"))" | encode > "$1"
}

rsudoenv_editor()
{
  export RSUDO_ENV_EDITOR="$1"
}

rsudoenv_edit()
{
  (
    export OPENSSL_PASS="$(readpass "enter decoding password for '$1':")"
    encoded_file_editor "$RSUDO_ENV_EDITOR"
    encoded_file_edit "$1"
  )
}

rsudoenv_get()
{
  if [ -z "$1" ]
  then
    log_debug "rsudoenv_get: empty name"
    return 1
  fi

  eval "export RSUDO_HOST=\"\$RSUDO_ENV_${1}_HOST\""
  eval "export RSUDO_USER=\"\$RSUDO_ENV_${1}_USER\""
  eval "export RSUDO_PASSWORD=\"\$RSUDO_ENV_${1}_PASS\""

  log_debug "rsudoenv_get: RSUDO_HOST=$RSUDO_HOST | RSUDO_USER=$RSUDO_USER"
  log_trace "rsudoenv_get: RSUDO_HOST=$RSUDO_HOST | RSUDO_USER=$RSUDO_USER | RSUDO_PASSWORD=$RSUDO_PASSWORD"
}

rsudoenv_set()
{
  if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]
  then
    log_debug "rsudoenv_set: empty args"
    return 1
  fi

  eval "export RSUDO_ENV_${1}_HOST=\"\${2}\""
  eval "export RSUDO_ENV_${1}_USER=\"\${3}\""
  eval "export RSUDO_ENV_${1}_PASS=\"\${4}\""

  eval "log_debug \"rsudoenv_set: RSUDO_ENV_${1}_HOST=\$RSUDO_ENV_${1}_HOST | RSUDO_ENV_${1}_USER=\$RSUDO_ENV_${1}_USER\""
  eval "log_trace \"rsudoenv_set: RSUDO_ENV_${1}_HOST=\$RSUDO_ENV_${1}_HOST | RSUDO_ENV_${1}_USER=\$RSUDO_ENV_${1}_USER | RSUDO_ENV_${1}_PASS=\$RSUDO_ENV_${1}_PASS\""
}

rsudoenv_unset()
{
  if [ -z "$1" ]
  then
    log_debug "rsudoenv_unset: empty name"
    return 1
  fi

  eval "unset RSUDO_ENV_${1}_HOST"
  eval "unset RSUDO_ENV_${1}_USER"
  eval "unset RSUDO_ENV_${1}_PASS"

  eval "log_debug \"rsudoenv_set: RSUDO_ENV_${1}_HOST=\$RSUDO_ENV_${1}_HOST | RSUDO_ENV_${1}_USER=\$RSUDO_ENV_${1}_USER\""
  eval "log_trace \"rsudoenv_set: RSUDO_ENV_${1}_HOST=\$RSUDO_ENV_${1}_HOST | RSUDO_ENV_${1}_USER=\$RSUDO_ENV_${1}_USER | RSUDO_ENV_${1}_PASS=\$RSUDO_ENV_${1}_PASS\""
}

rsudoenv_reset()
{
  export RSUDO_HOST="$1"
  shift

  export RSUDO_USER="$1"
  shift

  RSUDO_PASSWORD="$(readpass "[rsudo] Enter password for ${RSUDO_USER}@${RSUDO_HOST}:")"

  if [ -z "$RSUDO_PASSWORD" ]
  then
    log_fatal "password cannot be empty"
    return 1
  fi

  export RSUDO_PASSWORD

  log_debug "RSUDO STARTED: RSUDO_HOST=$RSUDO_HOST - RSUDO_USER=$RSUDO_USER - RSUDO_PASSWORD(availability)=$([ -n "$RSUDO_PASSWORD" ] && echo "yes" || echo "no")"
  log_trace "RSUDO STARTED: RSUDO_HOST=$RSUDO_HOST - RSUDO_USER=$RSUDO_USER - RSUDO_PASSWORD=$RSUDO_PASSWORD"
}

rsudoenv_exec()
{
  (
    rsudoenv_get "$1"
    shift

    rsudo "$@"
  )
}

rsudoenv_connect()
{
  # resolves connection params, then delegate to rsudoenv_hub
  # $connection_args $mod_args (connection_args: [user@host] | [$name] | [$env_file:$name]) -> that calls resudoenv_hub
  CONNECTION_ARGS="$1"
  shift

  if [ "$CONNECTION_ARGS" != "${CONNECTION_ARGS#*@}" ]
  then
    # user@host | @host -> always asks for password from tty user input
    RSUDO_HOST="${CONNECTION_ARGS#*@}"
    RSUDO_USER="${CONNECTION_ARGS%@*}"
    if [ -z "$RSUDO_USER" ]
    then
      RSUDO_USER="$USER"
    fi
    RSUDO_PASSWORD="$(readpass "[rsudo] Enter password for ${RSUDO_USER}@${RSUDO_HOST}:")"
  elif [ "$CONNECTION_ARGS" != "${CONNECTION_ARGS#*:}" ]
  then
    # env_encoded_file:env_name
    ENV_ENCODED_FILE="${CONNECTION_ARGS%:*}"
    ENV_GROUP_NAME="${CONNECTION_ARGS#*:}"
    if [ -z "$ENV_ENCODED_FILE" ]
    then
      log_warn "env file not provided, searching into current env. ENV_ENCODED_FILE=$ENV_ENCODED_FILE"
    else
      rsudoenv_load "$ENV_ENCODED_FILE"
    fi
    if ! rsudoenv_get "$ENV_GROUP_NAME"
    then
      log_fatal "env group name not found! ENV_GROUP_NAME=$ENV_GROUP_NAME"
      return 1
    fi
  else
    # env_name
    ENV_GROUP_NAME="$CONNECTION_ARGS"
    if ! rsudoenv_get "$ENV_GROUP_NAME"
    then
      log_fatal "env group name not found! ENV_GROUP_NAME=$ENV_GROUP_NAME"
      return 1
    fi
  fi

  rsudoenv_hub "$@"

# log_info COMMAND_LINE="$@"
#
# export RSUDO_HOST="$1"
# shift
#
# log_info RSUDO_HOST="$RSUDO_HOST"
#
# export RSUDO_USER="$1"
# shift
#
# log_info RSUDO_USER="$RSUDO_USER"
#
# log_info COMMAND_PARAMETERS="$@"
#
# RSUDO_PASSWORD="$(readpass "[rsudo] Enter password for ${RSUDO_USER}@${RSUDO_HOST}:")"
#
# if [ -z "$RSUDO_PASSWORD" ]
# then
#   log_fatal "password cannot be empty"
#   exit 1
# fi
#
# export RSUDO_PASSWORD
#
# rsudo "$@"

}

rsudoenv_hub()
{
  # resolves the sub-module to call or rsudo directly

  MODULE="rsudo-${MODULE}"
  if [ -f "$MODULE" ]
  then
    shift
  else
    MODULE="rsudo"
  fi

  "$MODULE" "$@"
}
