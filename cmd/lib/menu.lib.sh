#!/bin/sh

#-------------------------------------------------------------------------------

menukeys()
{
  set -- "$1" "$2" "$3" "${MENU_KEY_SEPARATOR:-":"}" "$(
    shift 3
    export MENU_CUSTOM_KEYS="$1"
    shift
    export MENU_KEY_SEPARATOR="${MENU_KEY_SEPARATOR:-":"}"
    menu "$@"
  )"

  eval "$1=\"${5%%${4}*}\""
  eval "$2=\"${5#*${4}}\""
  eval "$2=\"\${$2%%${4}*}\""
  eval "$3=\"${5#*${4}*${4}}\""
}

#-------------------------------------------------------------------------------

menuctl()
{
  case "$1" in
    "multi")
      shift
      # export MENU_MULTISELECTION="true"
      MENU_MULTISELECTION="true" "$@"
    ;;
    "keys")
      shift

      set -- "$1" "$2" "${MENU_KEY_SEPARATOR:-":"}" "$(
        shift 2
        export MENU_CUSTOM_KEYS="$1"
        shift
        export MENU_KEY_SEPARATOR="${MENU_KEY_SEPARATOR:-":"}"
        menu "$@"
      )"

      eval "$1=\"${4%%${3}*}\""
      eval "$2=\"${4#*${3}}\""
      eval "$2=\"${4#*${3}*${3}}\""
      # eval "$3=\"${4%%${3}*}\""
      # eval "$2=\"${4#*${3}}\""
    ;;
    *) exit 1;;
  esac
}
