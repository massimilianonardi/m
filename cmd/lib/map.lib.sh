#!/bin/sh

# map MAP_NAME size
# map MAP_NAME size SIZE_VAR_NAME
# map MAP_NAME get
# map MAP_NAME get KEY
# map MAP_NAME get KEY ELEM_VAR_NAME
# map MAP_NAME put KEY NEW_VALUE
# map MAP_NAME rem KEY
# map MAP_NAME set NEW_VALUES...
# map MAP_NAME unset

#-------------------------------------------------------------------------------

. arg.lib.sh
. env.lib.sh
. enc.lib.sh

#-------------------------------------------------------------------------------

map()
{
  eval "[ \"\$${1}_TYPE\" = \"map\" ]"
  if [ ! "$?" = "0" ]
  then
    if [ "$#" = "1" ]
    then
      eval "${1}_TYPE=\"map\""
      return 0
    else
      # echo "not an map!" 1>&2
      # exit 1
      return 1
    fi
  elif [ "$#" = "1" ]
  then
    map "$1" unset
    map "$1"
    return 0
  fi

  if [ "$#" -lt "2" ]
  then
    return 1
  fi

  case "$2" in
    "size")
      if [ -z "$3" ]
      then
        env_list "${1}_" | wc -l
      else
        eval "${3}=\"$(env_list "${1}_" | wc -l | tr -d '\n' | sed 's/\n//g')\""
      fi
    ;;
    "keys")
      set -- $(env_list "${1}__" | sed "s/${1}_//g")
      set -- $(
        while [ "$#" -gt "0" ]
        do
          # quote "$(o2a "$(echo "${1#*_}" | tr '_' ' ')")"
          quote "$(o2a "$(echo "${1}" | tr '_' ' ')")"
          echo ""
          shift
        done
      )
      echo "$@"
    ;;
    "get")
      if [ -z "$3" ]
      then
        set -- $(env_list "${1}__")
        set -- $(
          while [ "$#" -gt "0" ]
          do
            eval "echo \"\$(quote \"\$$1\")\""
            shift
          done
        )
        echo "$@"
        return 0
      fi
      eval "shift 3 && set -- \"$1\" \"$2\" \"$(a2o "$3" | tr ' ' '_')\" \"\$@\""
      if [ -z "$4" ]
      then
        eval "echo \"\$${1}_${3}\""
      else
        eval "${4}=\"\$${1}_${3}\""
      fi
    ;;
    "put")
      eval "shift 3 && set -- \"$1\" \"$2\" \"$(a2o "$3" | tr ' ' '_')\" \"\$@\""
      eval "${1}_${3}=\"\${4}\""
    ;;
    "rem")
      eval "shift 3 && set -- \"$1\" \"$2\" \"$(a2o "$3" | tr ' ' '_')\" \"\$@\""
      eval "unset ${1}_${3}"
    ;;
    # "set")
    #   map "$1" unset
    #   map "$1"
    #   set -- "$@" "${1}"
    #   shift 2
    #   while [ "$#" -gt "1" ]
    #   do
    #     eval "map \"\$$#\" add \"\$1\""
    #     shift
    #   done
    # ;;
    "unset")
      eval "unset ${1}_TYPE"
      set -- $(env_list "${1}__")
      while [ "$#" -gt "0" ]
      do
        unset "$1"
        shift
      done
    ;;
    *) exit 1;;
  esac
}
