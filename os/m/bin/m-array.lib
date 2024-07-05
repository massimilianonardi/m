#!/bin/sh

#-------------------------------------------------------------------------------

array_set()
{
  ARRAY_SET_i="2"
  while [ "$ARRAY_SET_i" -le "$#" ]
  do
    eval "${1}_$((ARRAY_SET_i - 2))=\"\$$ARRAY_SET_i\""
    ARRAY_SET_i="$((ARRAY_SET_i + 1))"
  done
  eval "${1}_TYPE=\"array\""
  eval "${1}_SIZE=\"\$((ARRAY_SET_i - 2))\""
  
  unset ARRAY_SET_i
}

#-------------------------------------------------------------------------------

array_check()
{
  eval "[ \"\$${1}_TYPE\" = \"array\" ]"
}

#-------------------------------------------------------------------------------

array_unset()
{
#  unset "$(echo-set-commands)"
  ARRAY_NAME="$1"
  
# todo check if is an array
  eval "n=\"\$((${ARRAY_NAME}_SIZE))\""
  i="0"
  while [ "$i" -lt "$n" ]
  do
    eval "unset ${ARRAY_NAME}_$i"
    i="$((i + 1))"
  done
  eval "unset ${ARRAY_NAME}_TYPE"
  eval "unset ${ARRAY_NAME}_SIZE"
  
  unset i
  unset n
  unset ARRAY_NAME
}

#-------------------------------------------------------------------------------

array_exec()
{
  ARRAY_NAME="$1"
  shift
  
  eval "n=\"\$((${ARRAY_NAME}_SIZE))\""
  i="0"
  while [ "$i" -lt "$n" ]
  do
    eval "k=\"\$${ARRAY_NAME}_$i\""
    set -- "$@" "$k"
    i="$((i + 1))"
  done
  
  unset i
  unset k
  unset n
  unset ARRAY_NAME
  
  "$@"
}

#-------------------------------------------------------------------------------

array_exec_loop()
{
  ARRAY_NAME="$1"
  shift
  
  eval "n=\"\$((${ARRAY_NAME}_SIZE))\""
  i="0"
  while [ "$i" -lt "$n" ]
  do
    eval "k=\"\$${ARRAY_NAME}_$i\""
    "$@" "$k"
    i="$((i + 1))"
  done
  
  unset i
  unset k
  unset n
  unset ARRAY_NAME
}

#-------------------------------------------------------------------------------
