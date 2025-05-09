#!/bin/sh

readc()
(
  if [ -t 0 ]
  then
    saved_tty_settings=$(stty -g)
    stty -echo -icanon min 1 time 0

    read -r key << EOF
$(dd bs=1 count=1 2>/dev/null | od -A n -t a)
EOF

    if [ "$key" = "esc" ]
    then
      stty -echo -icanon min 0 time 0
      read -r key1 << EOF
$(dd bs=1 count=1 2>/dev/null | od -A n -t a)
EOF
      read -r key2 << EOF
$(dd bs=1 count=1 2>/dev/null | od -A n -t a)
EOF
      read -r key3 << EOF
$(dd bs=1 count=1 2>/dev/null | od -A n -t a)
EOF
      read -r key4 << EOF
$(dd bs=1 count=1 2>/dev/null | od -A n -t a)
EOF
      key="$key1$key2$key3$key4"
      case "$key" in
        "[A") key="up";;
        "[B") key="down";;
        "[C") key="right";;
        "[D") key="left";;
        "[3~") key="canc";;
        *) key="esc$key";;
      esac
    elif [ "$key" = "sp" ]
    then
      key="space"
    elif [ "$key" = "ht" ]
    then
      key="tab"
    elif [ "$key" = "lf" ]
    then
      key="enter"
    elif [ "$key" = "nl" ]
    then
      key="enter"
    fi

    stty "$saved_tty_settings"

    echo "$key"
  else
    echo "no tty" 1>&2
    exit 1
  fi
)

readch()
{
  if [ -z "$1" ]
  then
    readc
  else
    eval "$1='$(readc)'"
  fi
}
