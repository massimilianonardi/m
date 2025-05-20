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

menuset()
{
  case "$1" in
    "multi")
      shift
      export MENU_MULTISELECTION="true"
    ;;
    "nomulti")
      shift
      export MENU_MULTISELECTION="false"
    ;;
    "id")
      shift
      export MENU_ID="true"
    ;;
    "noid")
      shift
      export MENU_ID="false"
    ;;
    "keys")
      shift
      export MENU_CUSTOM_KEYS="$1"
    ;;
    "header")
      shift
      export MENU_HEADER="$1"
    ;;
    "footer")
      shift
      export MENU_FOOTER="$1"
    ;;
    "region")
      shift
      export ROW_0="$1"
      export COL_0="$2"
      export ROWS="$3"
      export COLS="$4"
    ;;
    *) exit 1;;
  esac
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
    "nomulti")
      shift
      MENU_MULTISELECTION="false" "$@"
    ;;
    "id")
      shift
      MENU_ID="true" "$@"
    ;;
    "noid")
      shift
      MENU_ID="false" "$@"
    ;;
    "keys")
      shift
      MENU_CUSTOM_KEYS="$1"
      shift
      MENU_CUSTOM_KEYS="$MENU_CUSTOM_KEYS" "$@"
    ;;
    "header")
      shift
      MENU_HEADER="$1"
      shift
      MENU_HEADER="$MENU_HEADER" "$@"
    ;;
    "footer")
      shift
      MENU_FOOTER="$1"
      shift
      MENU_FOOTER="$MENU_FOOTER" "$@"
    ;;
    "region")
      shift
      ROW_0="$1"
      shift
      COL_0="$1"
      shift
      ROWS="$1"
      shift
      COLS="$1"
      shift
      ROW_0="$ROW_0" COL_0="$COL_0" ROWS="$ROWS" COLS="$COLS" "$@"
    ;;
    "assign")
      shift
      set -- "$1" "$2" "$3" "${MENU_KEY_SEPARATOR:-":"}" "$(
        shift 3
        MENU_KEY_SEPARATOR="${MENU_KEY_SEPARATOR:-":"}" "$@"
      )"

      eval "$1=\"${5%%${4}*}\""
      eval "$2=\"${5#*${4}}\""
      eval "$2=\"\${$2%%${4}*}\""
      eval "$3=\"${5#*${4}*${4}}\""
    ;;
    *) exit 1;;
  esac
}

#-------------------------------------------------------------------------------
