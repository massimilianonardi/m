#!/bin/sh

#-------------------------------------------------------------------------------

LANG_DEF="en_US.UTF-8"
LANG_DIR="${THIS_DIR%/*}/lang"
if [ -d "$LANG_DIR/$LANG" ]
then
  LANG_DIR="$LANG_DIR/$LANG"
elif [ -d "$LANG_DIR/$LANG_DEF" ]
then
  LANG_DIR="$LANG_DIR/$LANG_DEF"
fi

#-------------------------------------------------------------------------------

lang()
(
  n="$#"
  i="0"
  while [ "$i" -lt "$n" ]
  do
    if [ "$1" != "${1#@@}" ]
    then
      set -- "$@" "${1#@}"
      shift
      i="$((i + 1))"
    elif [ "$1" != "${1#@}" ]
    then
      MSG="$(lang_loop "$@")"
      ARGS_SHIFT="$?"
      set -- "$@" "$MSG"
      shift "$ARGS_SHIFT"
      i="$((i + ARGS_SHIFT))"
    else
      set -- "$@" "$1"
      shift
      i="$((i + 1))"
    fi
#echo "i=$i - n=$# - current args: $@"
  done
  
  "$@"
)

#-------------------------------------------------------------------------------

lang_loop()
{
  VAR="${1#@}"
  MSG=" $(env_list) "
#  [ "$MSG" = "${MSG#* $VAR *}" ] && MSG="$VAR"
  if [ "$MSG" = "${MSG#* $VAR *}" ]
  then
    MSG="$VAR"
  else
    eval "MSG=\"\${$VAR}\""
  fi
  shift
  
  i="0"
  while [ "$i" -lt "$#" ] && [ "$1" = "${1%!}" ] &&  [ "$1" = "${1#@}" ]
  do
    set -- "$@" "$1"
    shift
    i="$((i + 1))"
  done
  
  if [ "$1" != "${1%!}" ]
  then
    set -- "$@" "${1%!}"
    ARGS_SHIFT="$((i + 2))"
    shift "$(($# - i - 1))"
#    MSG="$(eval echo "$MSG")"
#    echo "$ARGS_SHIFT">&2
#    eval echo "$MSG">&2
    eval echo "$MSG"
    return "$ARGS_SHIFT"
  else
    ARGS_SHIFT="1"
#    echo "$ARGS_SHIFT">&2
#    echo "$MSG">&2
    echo "$MSG"
    return "$ARGS_SHIFT"
  fi
}

#-------------------------------------------------------------------------------

lang_load()
{
  if [ -f "$LANG_DIR/$1" ]
  then
    . "$LANG_DIR/$1"
  fi
}

#-------------------------------------------------------------------------------

lang_load "global"

#-------------------------------------------------------------------------------
