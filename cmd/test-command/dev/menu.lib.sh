#!/bin/sh

#-------------------------------------------------------------------------------

menueval()
{
  set -- "$1" $(eval eval \"\$$1\" && shift && "$@")
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

menuexec()
{
  if [ "$#" -lt "3" ]
  then
    return 1
  fi

  set -- "${1:-"key"}" "${2:-"res"}" "${3:-"selection"}" $(shift 3; "$@")

  eval "$1=${4}"
  eval "$2=${5}"

  if [ "$#" -lt "5" ]
  then
    return 0
  fi

  eval $3=\"$(shift 5; echo "$@")\"
}

#-------------------------------------------------------------------------------

menufs()
{
  if [ "$#" -lt "3" ]
  then
    return 1
  fi

  set -- "${1:-"key"}" "${2:-"res"}" "${3:-"selection"}" $(shift 3; menu-fs "$@")

  eval "$1=${4}"
  eval "$2=${5}"

  if [ "$#" -lt "5" ]
  then
    return 0
  fi

  eval $3=\"$(shift 5; echo "$@")\"
}

#-------------------------------------------------------------------------------

menuread()
{
  if [ "$#" -lt "3" ]
  then
    return 1
  fi

  # set -- "${1:-"key"}" "${2:-"res"}" "${3:-"selection"}" $(shift 3; menu "$@")
  set -- "${1:-"key"}" "${2:-"res"}" "${3:-"selection"}" $(shift 3; m_menu_MENU_CUSTOM_KEYS="${m_menu_MENU_CUSTOM_KEYS:-"unknown"}" menu "$@")

  eval "$1=${4}"
  eval "$2=${5}"

  if [ "$#" -lt "5" ]
  then
    return 0
  fi

  eval $3=\"$(shift 5; echo "$@")\"
}

#-------------------------------------------------------------------------------

menuset()
{
  case "$1" in
    "multi")
      shift
      export m_menu_MENU_MULTISELECTION="true"
    ;;
    "nomulti")
      shift
      export m_menu_MENU_MULTISELECTION="false"
    ;;
    "id")
      shift
      export m_menu_MENU_ID="true"
    ;;
    "noid")
      shift
      export m_menu_MENU_ID="false"
    ;;
    "keys")
      shift

      if [ "$#" -lt "1" ]
      then
        return 1
      fi

      export m_menu_MENU_CUSTOM_KEYS="$1"
    ;;
    "header")
      shift

      if [ "$#" -lt "1" ]
      then
        return 1
      fi

      export m_menu_MENU_HEADER="$1"
    ;;
    "footer")
      shift

      if [ "$#" -lt "1" ]
      then
        return 1
      fi

      export m_menu_MENU_FOOTER="$1"
    ;;
    "region")
      shift

      if [ "$#" -lt "4" ]
      then
        return 1
      fi

      export m_menu_ROW_0="$1"
      export m_menu_COL_0="$2"
      export m_menu_ROWS="$3"
      export m_menu_COLS="$4"
    ;;
    *) exit 1;;
  esac
}

#-------------------------------------------------------------------------------

menucmdshift()
{
  shift "$(($1 + 1))"
  "$@"
}

#-------------------------------------------------------------------------------

menucmd()
{
  case "$1" in
    "multi")
      shift
      m_menu_MENU_MULTISELECTION="true" "$@"
    ;;
    "nomulti")
      shift
      m_menu_MENU_MULTISELECTION="false" "$@"
    ;;
    "id")
      shift
      m_menu_MENU_ID="true" "$@"
    ;;
    "noid")
      shift
      m_menu_MENU_ID="false" "$@"
    ;;
    "keys")
      shift

      if [ "$#" -lt "1" ]
      then
        return 1
      fi

      m_menu_MENU_CUSTOM_KEYS="$1" menucmdshift "1" "$@"
    ;;
    "header")
      shift

      if [ "$#" -lt "1" ]
      then
        return 1
      fi

      m_menu_MENU_HEADER="$1" menucmdshift "1" "$@"
    ;;
    "footer")
      shift

      if [ "$#" -lt "1" ]
      then
        return 1
      fi

      m_menu_MENU_FOOTER="$1" menucmdshift "1" "$@"
    ;;
    "region")
      shift

      if [ "$#" -lt "4" ]
      then
        return 1
      fi

      m_menu_ROW_0="$1" m_menu_COL_0="$2" m_menu_ROWS="$3" m_menu_COLS="$4" menucmdshift "4" "$@"
    ;;
    *) exit 1;;
  esac
}

#-------------------------------------------------------------------------------
