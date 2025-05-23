#!/bin/sh

#-------------------------------------------------------------------------------

term_screen_init()
{
  if [ ! -t 0 ]
  then
    # echo "no tty" 1>&2
    # echo "no tty"
    exit 1
  fi

  saved_tty_settings=$(stty -g)
  stty -echo

  tput sc
  tput smcup
  tput clear

  trap "term_screen_reset; exit 2" INT QUIT TERM HUP PIPE ABRT TSTP

  term_screen_size_update
}

term_screen_reset()
{
  tput clear
  tput rmcup
  tput rc

  stty "$saved_tty_settings"
}

term_screen_size_update()
{
  # fix fo initial wrong values of size from tput
  tput clear
  i=0
  while [ "$i" -lt "999" ]
  do
    printf "                                                 "
    i="$(($i + 1))"
  done
  tput clear

  # get terminal size
  export TERM_ROWS="$(tput lines)"
  export TERM_COLS="$(tput cols)"
}

term_exit()
{
  term_screen_reset

  if [ -z "$1" ]
  then
    exit 1
  else
    exit "$1"
  fi
}

#-------------------------------------------------------------------------------

term_render()
{
  "$@"
  # "$@" >/dev/tty
}

term_output()
{
  "$@"
  # "$@" >/dev/stdio
}

term_error()
{
  "$@"
  # "$@" >/dev/stderr
  # "$@"  1>&2
}

___term_region_clear()
{
(
  i="$1"
  n="$(($1 + $3))"
  while [ "$i" -lt "$n" ]
  do
    tput cup "$i" "$2"
    printf "%${4}s"
    i="$(($i + 1))"
  done
)
}

term_region_clear()
{
  set -- "$1" "$2" "$3" "$4" "$1" "$(($1 + $3))"
  while [ "$5" -lt "$6" ]
  do
    tput cup "$5" "$2"
    printf "%${4}s"
    set -- "$1" "$2" "$3" "$4" "$(($5 + 1))" "$6"
  done
}

term_render_text_at()
{
(
  # IFS=$(printf '\n+'); IFS=${IFS%?}
  IFS='
'
  i="0"
  for line in $1
  do
    tput cup "$(($2 + $i))" "$3"
    printf "%s" "$line"
    i="$(($i + 1))"
  done
)
}

# to be put under subshell
tty_get_cursor_pos()
{
  if [ -z "$1" ]
  then
    if [ -z "$2" ]
    then
      set -- "row" "col"
    else
      set -- "row" "$2"
    fi
  elif [ -z "$2" ]
  then
    set -- "$1" "col"
  fi

  saved_tty_settings=$(stty -g)

  stty -echo -icanon min 0 time 1
  tput u7
  IFS='[;R' read -r dummy1 $1 $2 dummy2

  stty "$saved_tty_settings"
}

# to be removed (duplicate of term_render_text_at)
___screen_render_text_at()
{
(
  # IFS=$(printf '\n+'); IFS=${IFS%?}
  IFS='
'
  i="0"
  for line in $1
  do
    tput cup "$(($2 + $i))" "$3"
    printf "%s" "$line"
    i="$(($i + 1))"
  done
)
}

#-------------------------------------------------------------------------------
