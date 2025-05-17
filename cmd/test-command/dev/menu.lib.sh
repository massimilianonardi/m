#!/bin/sh

menuctl()
{
  case "$1" in
    "keys")
      shift

      if [ -z "$MENU_KEY_SEPARATOR" ]
      then
        export MENU_KEY_SEPARATOR=":"
      fi

      set -- "$1" "$2" "$(
        shift 2
        export MENU_CUSTOM_KEYS="$1"
        shift
        menu "$@"
      )"

      # echo "arg1=$1 arg2=$2 arg3=$3"
      eval "$1=\"${3%%${MENU_KEY_SEPARATOR}*}\""
      eval "$2=\"${3#*${MENU_KEY_SEPARATOR}}\""
    ;;
    *) exit 1;;
  esac
}
