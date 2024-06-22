#!/bin/sh

#-------------------------------------------------------------------------------

# looks for switches and options and remove them from command line leaving real arguments in the same order

# parses and removes switches and options while moves args at the end until --
COUNT="0"
TOTAL="$#"
MOVED="0"
log_trace "TOTAL: $TOTAL"
while [ "$COUNT" -lt "$TOTAL" ]
do
  if [ "$1" = "--" ]
  then
    shift
    log_debug "detected terminator --"
    break
  elif [ "$1" != "${1#--}" ]
  then
    log_debug "detected option: $1"
    parse_option "$@"
    r="$?"
    if [ "$r" -gt "0" ]
    then
      shift "$r"
      COUNT="$((COUNT + r))"
      log_trace "parse_option - managed $r arguments as an option - remaining args: $@"
    fi
  elif [ "$1" != "${1#-?}" ]
  then
    log_debug "detected switches: $1"
    parse_switch "$1" "$PARSE_ARGS_SWITCH"
    shift
    COUNT="$((COUNT + 1))"
  else
    set -- "$@" "$1"
    shift
    COUNT="$((COUNT + 1))"
    MOVED="$((MOVED + 1))"
  fi
done

# if -- then args after it are at the beginning because others have been moved to the end, thus must be moved them too
COUNT="$(($# - MOVED))"
while [ "$COUNT" -gt "0" ]
do
  set -- "$@" "$1"
  shift
  COUNT="$((COUNT - 1))"
done
for k in "$@"
do
  log_debug "detected regular arg: $k"
done

#-------------------------------------------------------------------------------
