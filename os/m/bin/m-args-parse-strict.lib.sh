#!/bin/sh

#-------------------------------------------------------------------------------

# strict order: n-args fixed, then switches, then options until --,
# then args start into array, then regular args, then args end into array.
# remaining command line has only regular args.

if [ -n "$ARGS_FIXED" ]
then
  args_array_set "ARGS_FIXED" "ARG_FIXED" "" "" "" "$@"
  shift "$ARGS_SHIFT"
fi

args_parse_switch_defaults

if [ "$1" != "${1#-?}" ]
then
  log_debug "detected switches: $1"
  args_parse_switch "$1" "$PARSE_ARGS_SWITCH"
  shift
fi

while [ "$1" != "${1#--}" ] && [ "$1" != "--" ]
do
  log_debug "detected option: $1"
  args_array_set_option "$@"
  shift "$ARGS_SHIFT"
  log_trace "parse_option - managed $r arguments as an option - remaining args: $@"
done

if [ "$1" = "--" ]
then
  shift
  log_debug "detected terminator -- remaining args: $@"
fi

if [ -n "$ARGS_START" ]
then
  args_array_set "ARGS_START" "ARG_START" "" "" "" "$@"
  shift "$ARGS_SHIFT"
fi

if [ -n "$ARGS_END" ]
then
  COUNT="0"
  TOTAL="$(($# - ARGS_END))"
  log_trace "parse_args - end args moving regular args: $TOTAL"
  while [ "$COUNT" -lt "$TOTAL" ]
  do
    set -- "$@" "$1"
    shift
    COUNT="$((COUNT + 1))"
  done

  args_array_set "ARGS_END" "ARG_END" "" "" "" "$@"
  shift "$ARGS_SHIFT"
fi

for k in "$@"
do
  log_debug "detected regular arg: $k"
done

#-------------------------------------------------------------------------------
