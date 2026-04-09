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
    exit 1
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
    exit 1
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
    exit 1
  fi

  eval "unset RSUDO_ENV_${1}_HOST"
  eval "unset RSUDO_ENV_${1}_USER"
  eval "unset RSUDO_ENV_${1}_PASS"

  eval "log_debug \"rsudoenv_set: RSUDO_ENV_${1}_HOST=\$RSUDO_ENV_${1}_HOST | RSUDO_ENV_${1}_USER=\$RSUDO_ENV_${1}_USER\""
  eval "log_trace \"rsudoenv_set: RSUDO_ENV_${1}_HOST=\$RSUDO_ENV_${1}_HOST | RSUDO_ENV_${1}_USER=\$RSUDO_ENV_${1}_USER | RSUDO_ENV_${1}_PASS=\$RSUDO_ENV_${1}_PASS\""
}

rsudoenv_exec()
{
  (
    rsudoenv_get "$1"
    shift

    rsudo "$@"
  )
}
