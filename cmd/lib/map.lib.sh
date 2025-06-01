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

. env.lib.sh

#-------------------------------------------------------------------------------

quote()
{
  # printf %s\\n "$1" | sed "s/'/'\\\\''/g;1s/^/'/;\$s/\$/'/"
  printf "%s" "$1" | sed "s/'/'\\\\''/g;1s/^/'/;\$s/\$/'/"
}

# current_args=$(saveargs "$@")
# set -- foo bar baz boo
# eval "set -- $current_args"
saveargs()
{
  for i
  do
    printf %s\\n "$i" | sed "s/'/'\\\\''/g;1s/^/'/;\$s/\$/' \\\\/"
  done
  echo " "
}

#-------------------------------------------------------------------------------

map()
{
  # eval "[ \"\$${1}_TYPE\" = \"map\" ]"
  # if [ ! "$?" = "0" ]
  # then
  #   if [ "$#" = "1" ]
  #   then
  #     eval "${1}_TYPE=\"map\""
  #     return 0
  #   else
  #     # echo "not an map!" 1>&2
  #     # exit 1
  #     return 1
  #   fi
  # elif [ "$#" = "1" ]
  # then
  #   map "$1" unset
  #   map "$1"
  #   return 0
  # fi

  if [ "$#" -lt "2" ]
  then
    return 1
  fi

  if [ "$#" -gt "2" ]
  then
    # eval "shift && set -- \"$(printf $1 | od -A n -t x1 | tr ' ' '_')\" \"\$@\""
    eval "shift 3 && set -- \"$1\" \"$2\" \"$(printf $3 | od -A n -t x1 | tr ' ' '_')\" \"\$@\""
    # for k in "$@"
    # do
    #   echo "k=$k"
    # done
    # exit 0
  fi

  case "$2" in
    "size")
      if [ -z "$3" ]
      then
        env_list "${1}_" | wc -l | tr -d '\n'
      else
        eval "${3}=\"$(env_list "${1}_" | wc -l | tr -d '\n' | sed 's/\n//g')\""
      fi
    ;;
    "get")
      if [ -z "$3" ]
      then
        set -- $(env_list "${1}_")
        # set -- $(env_list "${1}_") "$1"
    # for k in "$@"
    # do
    #   echo "k=$k"
    # done
    # exit 0
        # set -- $(
          while [ "$#" -gt "0" ]
          do
            # eval echo "\$(quote \"\$$1\")"
            # echo "$1"
            # echo "${1#*_}" | tr '_' ' '
            # echo "${1#*_}" | tr '_' ' ' | sed 's/\([0-9A-F]\{2\}\)/\\\\\\x\1/gI' | xargs printf
            # echo "${1#*_}" | tr '_' ' ' | sed 's/\(..\)/\\x\1/g' | xargs printf
            # echo "${1#*_}" | tr '_' ' ' | xxd -r -p
            echo "${1#*_}" | tr -d '_' | xxd -r -p
            # echo "${1#*_}" | tr '_' ' ' | od -c
            shift
          done
        # )
        # echo "$@"
        return 0
      fi
      if [ -z "$4" ]
      then
        eval "echo \"\$${1}_${3}\""
      else
        eval "${4}=\"\$${1}_${3}\""
      fi
    ;;
    "put")
      eval "${1}_${3}=\"\${4}\""
    ;;
    "rem")
      eval "[ \"${3}\" -lt \"\$${1}_SIZE\" ] || exit 1"
      set -- "$@" "$1" "set"
      while [ "$(($# - 5))" -lt "$3" ]
      do
        set -- "$@" "$(map "$1" get $(($# - 5)))"
      done
      while eval "[ \"\$(($# - 4))\" -lt \"\$${1}_SIZE\" ]"
      do
        set -- "$@" "$(map "$1" get $(($# - 4)))"
      done
      shift 3
      map "$@"
    ;;
    "set")
      map "$1" unset
      map "$1"
      set -- "$@" "${1}"
      shift 2
      while [ "$#" -gt "1" ]
      do
        eval "map \"\$$#\" add \"\$1\""
        shift
      done
    ;;
    "unset")
      eval "set -- \"\$1\" \"\$${1}_SIZE\""
      while [ "$2" -gt "0" ]
      do
        eval "${1}_SIZE=\"\$((\$${1}_SIZE - 1))\""
        eval "set -- \"\$1\" \"\$${1}_SIZE\""
        eval "unset ${1}_${2}"
      done
      eval "unset ${1}_SIZE"
      eval "unset ${1}_TYPE"
    ;;
    *) exit 1;;
  esac
}
