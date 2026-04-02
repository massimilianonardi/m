#!/bin/sh

#------------------------------------------------------------------------------

log()
{
  echo "RSUDO-lib $(date +"[%Y-%m-%d %H:%M:%S]")" "$@"
#  echo "RSUDO-lib $(date +"[%Y-%m-%d %H:%M:%S]")" "$@" 1>&2
}

#------------------------------------------------------------------------------

rse()
{
  # "rse_${1}" "$@"
  rse_"$@"
}

rse_load()
{
  true
}

rse_save()
{
  true
}

rse_editor()
{
  export RSUDO_ENV_EDITOR="$1"
}

rse_edit()
{
  true
}

rse_get()
{
  if [ -z "$1" ]
  then
    log "resolve_name get: empty name"
    exit 1
  fi

  eval "export RSUDO_HOST=\"\$RSUDO_ENV_${1}_HOST\""
  eval "export RSUDO_USER=\"\$RSUDO_ENV_${1}_USER\""
  eval "export RSUDO_PASSWORD=\"\$RSUDO_ENV_${1}_PASS\""

  log "resolve_name: RSUDO_HOST=$RSUDO_HOST | RSUDO_USER=$RSUDO_USER"
}

rse_set()
{
  if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]
  then
    log "resolve_name set: empty name"
    exit 1
  fi

  # TODO set password from hidden user input
  eval "export RSUDO_ENV_${1}_HOST=\"\${2}\""
  eval "export RSUDO_ENV_${1}_USER=\"\${3}\""
  eval "export RSUDO_ENV_${1}_PASS=\"\${4}\""

echo "set RSUDO_ENV_testvar_HOST=$RSUDO_ENV_testvar_HOST"
  eval echo "resolve_name: RSUDO_ENV_${1}_HOST=\$RSUDO_ENV_${1}_HOST | RSUDO_ENV_${1}_USER=\$RSUDO_ENV_${1}_USER"
}
