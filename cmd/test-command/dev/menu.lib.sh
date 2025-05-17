#!/bin/sh

menuctl()
{
  case "$1" in
    "keys")
      shift

      set -- "$1" "$2" "${MENU_KEY_SEPARATOR:-asd}" "$(
        shift 2
        export MENU_CUSTOM_KEYS="$1"
        shift
        export MENU_KEY_SEPARATOR="${MENU_KEY_SEPARATOR:-asd}"
        menu "$@"
      )"

      eval "$1=\"${4%%${3}*}\""
      eval "$2=\"${4#*${3}}\""
    ;;
    *) exit 1;;
  esac
}
