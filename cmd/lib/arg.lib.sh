#!/bin/sh

#------------------------------------------------------------------------------

quote()
{
  if [ -z "$1" ]
  then
    printf "''"
  fi

  # printf %s\\n "$1" | sed "s/'/'\\\\''/g;1s/^/'/;\$s/\$/'/"
  printf "%s" "$1" | sed "s/'/'\\\\''/g;1s/^/'/;\$s/\$/'/"
}

# current_args="$(saveargs "$@")"
# set -- foo bar baz boo
# eval "set -- $current_args"
___saveargs()
{
  for i
  do
    printf %s\\n "$i" | sed "s/'/'\\\\''/g;1s/^/'/;\$s/\$/' \\\\/"
  done
  echo " "
}

saveargs()
{
  for i
  do
    quote "$i"
    printf " "
  done
}

#-------------------------------------------------------------------------------
