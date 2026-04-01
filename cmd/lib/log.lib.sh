#!/bin/sh

#-------------------------------------------------------------------------------

log_echo()
{
  printf %s\\n "$*" 1>&2
}

#-------------------------------------------------------------------------------

log_line()
{
  log_echo "$(date +"[%Y-%m-%d %H:%M:%S]") [$PPID] [$$] [$LOG_PROC_NAME]" "$@"
}

#-------------------------------------------------------------------------------

log_line_filter_level()
{
  if [ $(($1)) -le $(($LOG_LEVEL_PRI)) ]
  then
    log_echo "$(date +"[%Y-%m-%d %H:%M:%S]") [$PPID] [$$] [$LOG_PROC_NAME]" "$@"
  fi
}

#-------------------------------------------------------------------------------

log_line_filter_proc()
{
  if [ "$LOG_PROC_NAME" = "$LOG_FILTER_PROC" ]
  then
    log_echo "$(date +"[%Y-%m-%d %H:%M:%S]") [$PPID] [$$] [$LOG_PROC_NAME]" "$@"
  fi
}

#-------------------------------------------------------------------------------

log_fatal()
{
  $LOG_LINE_FUNC 1 "[FATAL]" "$@"
}

log_error()
{
  $LOG_LINE_FUNC 2 "[ERROR]" "$@"
}

log_warn()
{
  $LOG_LINE_FUNC 3 "[WARN] " "$@"
}

log_info()
{
  $LOG_LINE_FUNC 4 "[INFO] " "$@"
}

log_debug()
{
  $LOG_LINE_FUNC 5 "[DEBUG]" "$@"
}

log_trace()
{
  $LOG_LINE_FUNC 6 "[TRACE]" "$@"
}

#-------------------------------------------------------------------------------

log_level_parse()
{
  if [ "$LOG_LEVEL" = "off" ] || [ "$LOG_LEVEL" = "none" ]
  then
    LOG_LEVEL_PRI="0"
  elif [ "$LOG_LEVEL" = "fatal" ]
  then
    LOG_LEVEL_PRI="1"
  elif [ "$LOG_LEVEL" = "error" ]
  then
    LOG_LEVEL_PRI="2"
  elif [ "$LOG_LEVEL" = "warn" ]
  then
    LOG_LEVEL_PRI="3"
  elif [ "$LOG_LEVEL" = "info" ]
  then
    LOG_LEVEL_PRI="4"
  elif [ "$LOG_LEVEL" = "debug" ]
  then
    LOG_LEVEL_PRI="5"
  elif [ "$LOG_LEVEL" = "trace" ] || [ "$LOG_LEVEL" = "all" ] || [ "$LOG_LEVEL" = "full" ] || [ "$LOG_LEVEL" = "max" ]
  then
    LOG_LEVEL_PRI="6"
  else
    log_fatal "LOG_LEVEL=$LOG_LEVEL"
    exit 1
  fi
}

#-------------------------------------------------------------------------------

if [ -z "$LOG_LINE_FUNC" ]
then
  LOG_LINE_FUNC="log_line_filter_level"
fi

LOG_PROC_NAME="$(ps -o "comm=" -p "$$")"

#if [ -z "$LOG_LEVEL" ] && [ -z "$LOG_LEVEL_PRI" ]
if [ -z "$LOG_LEVEL" ]
then
  LOG_LEVEL="info"
fi

log_level_parse
