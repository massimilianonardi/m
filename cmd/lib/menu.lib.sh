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
  set -- "${1:-"key"}" "${2:-"res"}" "${3:-"selection"}" $(shift 3; term_mod_MENU_CUSTOM_KEYS="${term_mod_MENU_CUSTOM_KEYS:-"unknown"}" menu "$@")

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
      export term_mod_MENU_MULTISELECTION="true"
    ;;
    "nomulti")
      shift
      export term_mod_MENU_MULTISELECTION="false"
    ;;
    "id")
      shift
      export term_mod_MENU_ID="true"
    ;;
    "noid")
      shift
      export term_mod_MENU_ID="false"
    ;;
    "keys")
      shift

      if [ "$#" -lt "1" ]
      then
        return 1
      fi

      export term_mod_MENU_CUSTOM_KEYS="$1"
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
      term_mod_MENU_MULTISELECTION="true" "$@"
    ;;
    "nomulti")
      shift
      term_mod_MENU_MULTISELECTION="false" "$@"
    ;;
    "id")
      shift
      term_mod_MENU_ID="true" "$@"
    ;;
    "noid")
      shift
      term_mod_MENU_ID="false" "$@"
    ;;
    "keys")
      shift

      if [ "$#" -lt "1" ]
      then
        return 1
      fi

      term_mod_MENU_CUSTOM_KEYS="$1" menucmdshift "1" "$@"
    ;;
    *) exit 1;;
  esac
}

#-------------------------------------------------------------------------------
