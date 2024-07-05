#!/bin/sh

#-------------------------------------------------------------------------------

echo()
{
  printf %s\\n "$*"
}

#-------------------------------------------------------------------------------

#[ -z "$LOG_LEVEL" ] && export LOG_LEVEL="3"
[ -n "$LOG_LEVEL_FORCE" ] && LOG_LEVEL="$LOG_LEVEL_FORCE" && LOG_LEVEL_FORCE="" || LOG_LEVEL="3"

log_level_parse()
{
  [ "$LOG_LEVEL" = "off" ] && LOG_LEVEL="0"
  [ "$LOG_LEVEL" = "none" ] && LOG_LEVEL="0"
  [ "$LOG_LEVEL" = "fatal" ] && LOG_LEVEL="1"
  [ "$LOG_LEVEL" = "error" ] && LOG_LEVEL="2"
  [ "$LOG_LEVEL" = "warn" ] && LOG_LEVEL="3"
  [ "$LOG_LEVEL" = "info" ] && LOG_LEVEL="4"
  [ "$LOG_LEVEL" = "debug" ] && LOG_LEVEL="5"
  [ "$LOG_LEVEL" = "trace" ] && LOG_LEVEL="6"
  [ "$LOG_LEVEL" = "all" ] && LOG_LEVEL="6"
  [ "$LOG_LEVEL" = "full" ] && LOG_LEVEL="6"
  [ "$LOG_LEVEL" = "max" ] && LOG_LEVEL="6"
  true
}

log_level_parse

[ -n "$LOG_SUBPROCESS_LEVEL" ] && LOG_SUBPROCESS_LEVEL="$(($LOG_SUBPROCESS_LEVEL + 1))" && LOG_SUBPROCESS_PROGRESS=". $LOG_SUBPROCESS_PROGRESS"
[ -z "$LOG_SUBPROCESS_LEVEL" ] && export LOG_SUBPROCESS_LEVEL="0" && export LOG_SUBPROCESS_PROGRESS=""
[ -n "$LOG_SUBPROCESS_LEVEL_STEP" ] && LOG_LEVEL="$(($LOG_LEVEL + $LOG_SUBPROCESS_LEVEL * $LOG_SUBPROCESS_LEVEL_STEP))" && [ "$LOG_LEVEL" -lt "0" ] && LOG_LEVEL="0"
#[ -z "$LOG_SUBPROCESS_LEVEL_STEP" ] && export LOG_SUBPROCESS_LEVEL_STEP="-1"
[ -z "$LOG_SUBPROCESS_LEVEL_STEP" ] && export LOG_SUBPROCESS_LEVEL_STEP="0"
[ -z "$LOG_SUBPROCESS_LEVEL_MAX" ] && export LOG_SUBPROCESS_LEVEL_MAX="100"
true

[ -z "$TRACE_LEVEL" ] && export TRACE_LEVEL="0" && export TRACE_PROGRESS=""
[ -z "$TRACE_LEVEL_MAX" ] && export TRACE_LEVEL_MAX="100"
true

log_filter()
{
  [ "$#" = "0" ] && echo "$LOG_FILTER"
  
  for k in "$@"
  do
    LOG_FILTER="$LOG_FILTER $k"
  done
  LOG_FILTER="$LOG_FILTER "
  unset k
}

log_exclude()
{
  [ "$#" = "0" ] && echo "$LOG_EXCLUDE"
  
  for k in "$@"
  do
    LOG_EXCLUDE="$LOG_EXCLUDE $k"
  done
  LOG_EXCLUDE="$LOG_EXCLUDE "
  unset k
}

log()
{
#  if [ $(($1)) -le $(($LOG_LEVEL)) ]
  if [ $(($1)) -le $(($LOG_LEVEL)) ] && ([ -z "$TRACE_COMMAND" ] || [ "$LOG_FILTER" = "${LOG_FILTER#* $TRACE_COMMAND *}" ])
#  if [ $(($1)) -le $(($LOG_LEVEL)) ] && [ "$LOG_EXCLUDE" = "${LOG_EXCLUDE#* $TRACE_COMMAND *}" ] && [ $((LOG_SUBPROCESS_LEVEL)) -le $((LOG_SUBPROCESS_LEVEL_MAX)) ]
  then
#    echo "$(date +"[%Y-%m-%d %H:%M:%S]")" "[$LOG_SUBPROCESS_PROGRESS$LOG_SUBPROCESS_LEVEL]" "[$THIS_NAME]" "[$$]" "$TRACE_PROGRESS" "$@"
    LOG_CURR_LLN="$1"
    shift
    LOG_CURR_LLT="$1"
    shift
#    echo "$(date +"[%Y-%m-%d %H:%M:%S]")" "$LOG_CURR_LLN $LOG_CURR_LLT" "[$LOG_SUBPROCESS_PROGRESS$LOG_SUBPROCESS_LEVEL]" "[$THIS_NAME]" "[$$]" "$TRACE_PROGRESS" "[$TRACE_COMMAND]" "$@"
    echo "$(date +"[%Y-%m-%d %H:%M:%S]")" "$LOG_CURR_LLN $LOG_CURR_LLT" "[$LOG_SUBPROCESS_PROGRESS$LOG_SUBPROCESS_LEVEL]" "[$THIS_NAME]" "[$$]" "[$(printf "% 5d" $TRACE_LEVEL)]" "$TRACE_PROGRESS" "[$TRACE_COMMAND]" "$@"
  fi
}

log_fatal()
{
  log 1 "[FATAL]" "$@">&2
}

log_error()
{
  log 2 "[ERROR]" "$@">&2
}

log_warn()
{
  log 3 "[WARN] " "$@">&2
}

log_info()
{
  log 4 "[INFO] " "$@">&2
}

log_debug()
{
  log 5 "[DEBUG]" "$@">&2
}

log_trace()
{
  log 6 "[TRACE]" "$@">&2
}

#-------------------------------------------------------------------------------

fatal()
{
  log_fatal "$@"
  exit 1
}

#-------------------------------------------------------------------------------

trace()
{
  TRACE_INVOKATION="$1"
  shift
  TRACE_TERMINATION="$1"
  shift
  
  [ "$TRACE_LEVEL" -le "$TRACE_LEVEL_MAX" ] && log_trace "[EXECUTE] [$(printf "% 5d" $TRACE_LEVEL)] $TRACE_PROGRESS>              ": "[$TRACE_INVOKATION]" "$@"
  
  if [ "$((LOG_SUBPROCESS_LEVEL))" -gt "$((LOG_SUBPROCESS_LEVEL_MAX))" ] || ([ -n "$1" ] && [ "$LOG_EXCLUDE" != "${LOG_EXCLUDE#* $1 *}" ])
#  if [ "$((LOG_SUBPROCESS_LEVEL))" -gt "$((LOG_SUBPROCESS_LEVEL_MAX))" ] || [ -n "$TRACE_COMMAND" ] && [ "$LOG_EXCLUDE" != "${LOG_EXCLUDE#* $TRACE_COMMAND *}" ]
#  if [ "$((LOG_SUBPROCESS_LEVEL))" -gt "$((LOG_SUBPROCESS_LEVEL_MAX))" ]
  then
    log_debug "[LOG_LEVEL_SWITCH][$LOG_LEVEL->3][reason: $((LOG_SUBPROCESS_LEVEL)) -gt $((LOG_SUBPROCESS_LEVEL_MAX)) || (-n $1 && $1 in LOG_EXCLUDE='$LOG_EXCLUDE')]"
    LOG_LEVEL_OLD="$LOG_LEVEL"
    LOG_LEVEL="3"
  fi
  
  if [ "$TRACE_INVOKATION" = "call" ]
  then
    TRACE_LEVEL="$(($TRACE_LEVEL + 1))"
    TRACE_PROGRESS="-$TRACE_PROGRESS"
    TRACE_STACK="$TRACE_STACK $1"
    TRACE_COMMAND="$1"
    "$@"
    EXIT_CODE="$?"
    TRACE_LEVEL="$(($TRACE_LEVEL - 1))"
    TRACE_PROGRESS="${TRACE_PROGRESS%-}"
    TRACE_STACK="${TRACE_STACK% *}"
    TRACE_COMMAND="${TRACE_STACK##* }"
  elif [ "$TRACE_INVOKATION" = "exec" ]
  then
    (TRACE_LEVEL="$(($TRACE_LEVEL + 1))" TRACE_PROGRESS="-$TRACE_PROGRESS" TRACE_STACK="$TRACE_STACK $1" TRACE_COMMAND="$1" "$@")
    EXIT_CODE="$?"
  else
    fatal "bad trace arguments"
  fi
  
  if [ "$EXIT_CODE" = "0" ]
  then
    TRACE_STATUS="OK   "
  else
    TRACE_STATUS="ERROR"
  fi
  
  if [ "$((LOG_SUBPROCESS_LEVEL))" -gt "$((LOG_SUBPROCESS_LEVEL_MAX))" ] || ([ -n "$1" ] && [ "$LOG_EXCLUDE" != "${LOG_EXCLUDE#* $1 *}" ])
#  if [ "$((LOG_SUBPROCESS_LEVEL))" -le "$((LOG_SUBPROCESS_LEVEL_MAX))" ] || [ -z "$1" ] || [ "$LOG_EXCLUDE" = "${LOG_EXCLUDE#* $1 *}" ]
#  if [ "$((LOG_SUBPROCESS_LEVEL))" -gt "$((LOG_SUBPROCESS_LEVEL_MAX))" ] || [ -n "$TRACE_COMMAND" ] && [ "$LOG_EXCLUDE" != "${LOG_EXCLUDE#* $TRACE_COMMAND *}" ]
#  if [ "$((LOG_SUBPROCESS_LEVEL))" -gt "$((LOG_SUBPROCESS_LEVEL_MAX))" ]
  then
    LOG_LEVEL="$LOG_LEVEL_OLD"
    log_debug "[LOG_LEVEL_RESTORE][3->$LOG_LEVEL_OLD][reason was: $((LOG_SUBPROCESS_LEVEL)) -gt $((LOG_SUBPROCESS_LEVEL_MAX)) || (-n $1 && $1 in LOG_EXCLUDE='$LOG_EXCLUDE')]"
#    log_debug "[LOG_LEVEL_RESTORE][3->$LOG_LEVEL_OLD][reason: $((LOG_SUBPROCESS_LEVEL)) -le $((LOG_SUBPROCESS_LEVEL_MAX)) || -z $1 || $1 not in LOG_EXCLUDE='$LOG_EXCLUDE']"
  fi
  
  [ "$TRACE_LEVEL" -le "$TRACE_LEVEL_MAX" ] && log_trace "[EXECUTE] [$(printf "% 5d" $TRACE_LEVEL)] <$TRACE_PROGRESS [$TRACE_STATUS] [$(printf "% 3d" $EXIT_CODE)]": "[$TRACE_TERMINATION]" "$@"
  
  if [ "$TRACE_TERMINATION" = "return" ]
  then
    return "$EXIT_CODE"
  elif [ "$TRACE_TERMINATION" = "exit" ]
  then
    if [ "$EXIT_CODE" = "0" ]
    then
      return "$EXIT_CODE"
    else
      exit "$EXIT_CODE"
    fi
  else
    fatal "bad trace arguments"
  fi
}

#-------------------------------------------------------------------------------
