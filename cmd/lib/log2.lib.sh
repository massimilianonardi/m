#!/bin/sh

# LOG_LINE_FUNC: delegates from "log [level]" functions to a single function that process the message
# LOG_LINE_FUNC usually uses an intermediate function level (filter function -> LOG_LINE_FUNC_FILTER)
# a filter function decide if to process a message or not based on a parameter (log level, proc name, pid, etc.)
# every filter function delegates to a formatter function LOG_LINE_FUNC_FORMATTER that decides how to print the log line
# an important formatter function takes into account translated lang messages
# log formatter lang: $level $level-string -- $msg-lang-var $@
# log formatter vars: $msg [variables] -> composes (eval) msg with values of vars using $1, $2, etc. into msg
# most dynamic delegation needs a function array of delegates, or specific delegationvariable for each function

#-------------------------------------------------------------------------------

# delegates to proper lib function
log()
{
  log_"$@"
}

#-------------------------------------------------------------------------------

# delegates to external logfile command
# log_file()
# {
#   logfile "$@"
# }

#-------------------------------------------------------------------------------

# base printing function that redirects to stderr
log_echo()
{
  printf %s\\n "$*" 1>&2
}

#-------------------------------------------------------------------------------

log_fatal()
{
  $LOG_LINE_FUNC "1" "fatal" "$@"
}

log_error()
{
  $LOG_LINE_FUNC "2" "error" "$@"
}

log_warn()
{
  $LOG_LINE_FUNC "3" "warn " "$@"
}

log_info()
{
  $LOG_LINE_FUNC "4" "info " "$@"
}

log_debug()
{
  $LOG_LINE_FUNC "5" "debug" "$@"
}

log_trace()
{
  $LOG_LINE_FUNC "6" "trace" "$@"
}

#-------------------------------------------------------------------------------

# filters out messages below current log level and delegates to $LOG_LINE_FUNC_FILTER_LEVEL
log_line_func_filter_level()
{
  if [ $(($1)) -le $(($LOG_LEVEL_PRI)) ]
  then
    (
      LOG_MESSAGE_PRI="$1"
      shift
      LOG_MESSAGE_LEVEL="$1"
      shift
      $LOG_LINE_FUNC_FILTER_LEVEL "$@"
    )
  fi
}

#-------------------------------------------------------------------------------

# if message is "--" then message is retrieved from a variable and delegated to $LOG_LINE_FUNC_FORMATTER_LANG
log_line_func_formatter_lang()
{
  if [ "$1" = "--" ]
  then
    shift
    eval "LOG_MESSAGE_TRANSLATION=\"\$$1\""
    shift
    set -- "$LOG_MESSAGE_TRANSLATION" "$@"
  fi

  $LOG_LINE_FUNC_FORMATTER_LANG "$@"
}

#-------------------------------------------------------------------------------

# $1 is evaluated passing subsequent args ot it and delegated to $LOG_LINE_FUNC_FORMATTER_VARS
log_line_func_formatter_vars()
{
  LOG_MESSAGE_VAR_MESSAGE="$1"
  shift

  for k in "$@"
  do
    if (eval echo "\${$k}" 1>/dev/null 2>/dev/null) && (eval "[ -n \"\${$k+true}\" ]")
    then
      LOG_MESSAGE_VAR_VARS="$LOG_MESSAGE_VAR_VARS [$k=\"\${$k}\"]"
      set -- "$@" "$(eval echo "\$$k")"
      shift
    else
      LOG_MESSAGE_VAR_MESSAGE="$LOG_MESSAGE_VAR_MESSAGE $k"
      set -- "$@" "$k"
      shift
    fi
  done

  eval "LOG_MESSAGE_VAR_MESSAGE=\"$LOG_MESSAGE_VAR_MESSAGE $LOG_MESSAGE_VAR_VARS\""

  # $LOG_LINE_FUNC_FORMATTER_VARS "$LOG_MESSAGE_VAR_MESSAGE" "$@"
  $LOG_LINE_FUNC_FORMATTER_VARS "$LOG_MESSAGE_VAR_MESSAGE"
}

#-------------------------------------------------------------------------------

log_line()
{
  log_echo "$(date +"[%Y-%m-%d %H:%M:%S]") [${PPID}>${$}] [$LOG_PROC_NAME] [$LOG_MESSAGE_PRI] [$LOG_MESSAGE_LEVEL]" "$@"
}

#-------------------------------------------------------------------------------

log_level()
{
  if [ -z "$1" ]
  then
    log_fatal "log_level: empty arg"
    return 1
  fi

  export LOG_LEVEL="$1"
  log_level_parse
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

  export LOG_LEVEL_PRI
}

#-------------------------------------------------------------------------------

if [ -z "$LOG_LINE_FUNC" ]
then
  LOG_LINE_FUNC="log_line_func_filter_level"
fi

if [ -z "$LOG_LINE_FUNC_FILTER_LEVEL" ]
then
  LOG_LINE_FUNC_FILTER_LEVEL="log_line_func_formatter_lang"
fi

if [ -z "$LOG_LINE_FUNC_FORMATTER_LANG" ]
then
  LOG_LINE_FUNC_FORMATTER_LANG="log_line_func_formatter_vars"
fi

if [ -z "$LOG_LINE_FUNC_FORMATTER_VARS" ]
then
  LOG_LINE_FUNC_FORMATTER_VARS="log_line"
fi

if [ -z "$LOG_PROC_NAME" ]
then
  LOG_PROC_NAME="$(ps -o "comm=" -p "$$")"
fi

#if [ -z "$LOG_LEVEL" ] && [ -z "$LOG_LEVEL_PRI" ]
if [ -z "$LOG_LEVEL" ]
then
  LOG_LEVEL="info"
fi

log_level_parse
