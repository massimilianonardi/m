#!/bin/sh

#-------------------------------------------------------------------------------

menuread()
{
  if [ "$#" -lt "3" ]
  then
    return 1
  fi

  set -- "${1:-"key"}" "${2:-"res"}" "${3:-"selection"}" $(shift 3; menu "$@")

  # eval "$1=\"${4}\""
  # eval "$2=\"${5}\""
  eval "$1=${4}"
  eval "$2=${5}"
  eval $3=\"$(shift 5; echo "$@")\"
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

      if [ "$#" -lt "1" ]
      then
        return 1
      fi

      export MENU_CUSTOM_KEYS="$1"
    ;;
    "header")
      shift

      if [ "$#" -lt "1" ]
      then
        return 1
      fi

      export MENU_HEADER="$1"
    ;;
    "footer")
      shift

      if [ "$#" -lt "1" ]
      then
        return 1
      fi

      export MENU_FOOTER="$1"
    ;;
    "region")
      shift

      if [ "$#" -lt "4" ]
      then
        return 1
      fi

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

      if [ "$#" -lt "1" ]
      then
        return 1
      fi

      MENU_CUSTOM_KEYS="$1"
      shift
      MENU_CUSTOM_KEYS="$MENU_CUSTOM_KEYS" "$@"
    ;;
    "header")
      shift

      if [ "$#" -lt "1" ]
      then
        return 1
      fi

      MENU_HEADER="$1"
      shift
      MENU_HEADER="$MENU_HEADER" "$@"
    ;;
    "footer")
      shift

      if [ "$#" -lt "1" ]
      then
        return 1
      fi

      MENU_FOOTER="$1"
      shift
      MENU_FOOTER="$MENU_FOOTER" "$@"
    ;;
    "region")
      shift

      if [ "$#" -lt "4" ]
      then
        return 1
      fi

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
    *) exit 1;;
  esac
}

#-------------------------------------------------------------------------------
