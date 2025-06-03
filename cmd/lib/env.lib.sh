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

# env_set()
env_return_set()
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

# env_cmdscope()
env_return_cmd()
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

# env_export()
env_return_export()
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

  if [ "$ENV_RETURN" = "export" ]
  then
    env_return_export "$ENV_LIST"
  elif [ "$ENV_RETURN" = "cmd" ]
  then
    env_return_cmd "$ENV_LIST"
  elif [ "$ENV_RETURN" = "set" ]
  then
    env_return_set "$ENV_LIST"
  fi
)
}

#-------------------------------------------------------------------------------

env_import()
{
  if [ "$#" -lt "1" ]
  then
    return 1
  fi

  eval "$1"
  shift

  ENV_IMPORT="true" "$@"
}

#-------------------------------------------------------------------------------

env_export()
{
  if [ "$#" -lt "1" ]
  then
    return 1
  fi

  set -- "$1" $(shift && ENV_RETURN="${ENV_RETURN:-"export"}" "$@")
  eval $1=\"$(shift && echo "$@")\"
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
