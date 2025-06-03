#!/bin/sh

#-------------------------------------------------------------------------------

. arg.lib.sh

#-------------------------------------------------------------------------------

exist_function()
{
  type "$1">/dev/null 2>&1
}

#-------------------------------------------------------------------------------

exec_if_exist_function()
{
  exist_function "$1" && "$@"
}

#-------------------------------------------------------------------------------

env_list()
{
  if [ -z "$*" ]
  then
    set | sed '/='\''/,/'\''$/ {s/='\''.*//p; /.*/d}'
  else
    set | sed '/='\''/,/'\''$/ {s/='\''.*//p; /.*/d}' | grep -e "$@"
  fi
}

#-------------------------------------------------------------------------------

env_set()
{
  if [ -z "$*" ]
  then
    return 0
  fi

  if [ "$#" = "1" ]
  then
    set -- $@
  fi

  while [ "$#" -gt "0" ]
  do
    eval quoted="\$(quote \"\$$1\")"
    eval printf "$1=\"$quoted; \""
    shift
  done
}

#-------------------------------------------------------------------------------

env_cmdscope()
{
  if [ -z "$*" ]
  then
    return 0
  fi

  if [ "$#" = "1" ]
  then
    set -- $@
  fi

  while [ "$#" -gt "0" ]
  do
    eval quoted="\$(quote \"\$$1\")"
    eval printf "$1=\"$quoted \""
    shift
  done
}

#-------------------------------------------------------------------------------

env_export()
{
  if [ -z "$*" ]
  then
    return 0
  fi

  if [ "$#" = "1" ]
  then
    set -- $@
  fi

  while [ "$#" -gt "0" ]
  do
    eval quoted="\$(quote \"\$$1\")"
    eval echo "export $1=\"$quoted; \""
    shift
  done
}

#-------------------------------------------------------------------------------

env_return()
{
(
  if [ -n "$1" ]
  then
    ENV_RETURN="$1"
    shift
  fi

  if [ -n "$*" ]
  then
    ENV_LIST="$@"
  fi

  if [ -z "$ENV_RETURN" ]
  then
    return 1
  elif [ -z "$ENV_LIST" ]
  then
    # return 0
    ENV_LIST="$(env_list)"
  fi

#   ENV_LIST='ENV_RETURN
# ENV_LIST
# '"$ENV_LIST"

  if [ "$ENV_RETURN" = "export" ]
  then
    env_export "$ENV_LIST"
  elif [ "$ENV_RETURN" = "cmdscope" ]
  then
    env_cmdscope "$ENV_LIST"
  elif [ "$ENV_RETURN" = "set" ] || [ -z "$ENV_RETURN" ]
  then
    env_set "$ENV_LIST"
  fi
)
}

#-------------------------------------------------------------------------------

# rework to call env-aware script to import env
env_import()
{
  [ -n "$ENV_IMPORT" ]
  # if [ -z "$ENV_IMPORT" ]
  # then
  #   "$@"
  # fi
}

#-------------------------------------------------------------------------------

env_eval()
{
  # export ENV_RETURN="export"
  set -- "$1" $(eval eval \"\$$1\" && shift && ENV_IMPORT="true" ENV_RETURN="${ENV_RETURN:-"export"}" "$@")
#   set -- "$1" \
#   $(
# eval echo "arg1=\$$1"
# eval echo "arg1=\$$1" 1>&2
# read x
#     if eval [ -n "\$$1" ]
#     then
#       # eval eval \"\$$1\"
#       eval eval \$$1
#     fi
#     shift
#     "$@"
#   )
  eval $1=\"$(shift && echo "$@")\"
}

#-------------------------------------------------------------------------------

# caller functions to be eventually defined:
# env_init "$@", main "$@", env_list_get, env_return_res
env_main()
{
  [ -n "$ENV_IMPORT" ] || exec_if_exist_function env_init "$@"

  # exec_if_exist_function main "$@"
  exec_if_exist_function main

  ENV_LIST="$(exec_if_exist_function env_list_get)"
  env_return || exec_if_exist_function env_return_res
}

#-------------------------------------------------------------------------------
