#!/bin/sh

#-------------------------------------------------------------------------------

env_list()
{
  if [ -z "$*" ]
  then
    # set | sed 's|=.*||g'
    set
    # set | sed -n "/.*=/{p; :a; N; /'/!ba; s/.*\n//}; p"
    # env awk 'BEGIN{for(v in ENVIRON) print v}' | sort
  else
    set | grep -e "$@" | sed 's|=.*||g'
    # env awk 'BEGIN{for(v in ENVIRON) print v}' | grep -e "$@" | sort
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
  # for k in $@
  # do
  #   eval quoted="\$(quote \"\$$k\")"
  #   eval printf "$k=\"$quoted \""
  # done

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
    # (eval quoted="\$(quote \"\$$1\")"
    # eval echo "export $1=\"$quoted; \"")
    (
      # eval quoted="\$(quote \"\$$1\")"
      eval echo "n=$# arg=$1 val=\"\$$1\""
    )
# echo "?=$? arg=$1"
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

  ENV_LIST='ENV_RETURN
ENV_LIST
'"$ENV_LIST"
echo "ENV_LIST=$ENV_LIST"
return 7

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

exit 5
  return 0
)
}

#-------------------------------------------------------------------------------
