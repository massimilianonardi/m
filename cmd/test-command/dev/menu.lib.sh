#!/bin/sh

menuctl()
{
  case "$1" in
    # "esc") quit;;
    # "esc")
    #   quit
    # ;;
    "keys")
      # if [ -z "$MENU_KEY_SEPARATOR" ]
      # then
      #   export MENU_KEY_SEPARATOR="="
      # fi
      shift
      key_var="$1"
      shift
      res_var="$1"
      shift
      set -- "$(
        export MENU_CUSTOM_KEYS="$1"
        shift
        menu "$@"
        # echo "$(menu "$@")"
        # res="$(menu "$@")"
        # echo "$res"
      )"
      echo "arg1=$1"
      eval "$key_var=\"${1%%${MENU_KEY_SEPARATOR}*}\""
      eval "$res_var=\"${1#*${MENU_KEY_SEPARATOR}}\""
    ;;
    *) exit 1;;
  esac
}
