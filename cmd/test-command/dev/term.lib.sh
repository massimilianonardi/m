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
  # trap "term_screen_reset; exit 2" INT QUIT TERM HUP PIPE ABRT TSTP EXIT

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

  # echo "row=$row"
  # echo "col=$col"
  # read x
}

screen_render_text_at()
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
