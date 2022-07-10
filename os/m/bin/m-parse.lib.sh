#!/bin/sh

#-------------------------------------------------------------------------------

DOC_DIR="${THIS_DIR%/*}/doc/$THIS_NAME"
if [ -d "$DOC_DIR/$LANG" ]
then
  DOC_DIR="$DOC_DIR/$LANG"
elif [ -d "$DOC_DIR/$LANG_DEF" ]
then
  DOC_DIR="$DOC_DIR/$LANG_DEF"
fi

#-------------------------------------------------------------------------------

[ -z "$LOG_FILTER" ] && log_filter args_parse args_parse_format_easy args_parse_format_smart args_parse_format_strict

if [ "$ARGS_PARSE" = "true" ]
then
  ARGS_DOC_FORMAT_smart="smart format"
  
#  [ -z "$ARGS_FORMAT" ] && ARGS_FORMAT="easy"
  [ -z "$ARGS_FORMAT" ] && ARGS_FORMAT="smart"
  
  [ -z "$ARGS_SWITCH_ON" ] && ARGS_SWITCH_ON="true"
  [ -z "$ARGS_SWITCH_OFF" ] && ARGS_SWITCH_OFF=""
  
  [ -z "$ARGS_OPTION_ON" ] && ARGS_OPTION_ON="true"
  [ -z "$ARGS_OPTION_OFF" ] && ARGS_OPTION_OFF=""
  
  if [ -n "$ARGS_SWITCH" ]
  then
    [ -z "$ARGS_SWITCH_VARIABLE_PREFIX" ] && ARGS_SWITCH_VARIABLE_PREFIX="SWITCH"
  fi
  
  if [ -n "$ARGS_OPTION" ]
  then
    [ -z "$ARGS_OPTION_VARIABLE_PREFIX" ] && ARGS_OPTION_VARIABLE_PREFIX="OPTION"
    [ -z "$ARGS_OPTION_FUNCTION_PREFIX" ] && ARGS_OPTION_FUNCTION_PREFIX="option"
    ARGS_OPTION=" $ARGS_OPTION "
  fi
  
  if [ -n "$ARGS_FIXED" ]
  then
    [ -z "$ARGS_FIXED_VARIABLE_PREFIX" ] && ARGS_FIXED_VARIABLE_PREFIX="ARG_FIXED"
  fi
  
  if [ -n "$ARGS_START" ]
  then
    [ -z "$ARGS_START_VARIABLE_PREFIX" ] && ARGS_START_VARIABLE_PREFIX="ARG_START"
  fi
  
  if [ -n "$ARGS_END" ]
  then
    [ -z "$ARGS_END_VARIABLE_PREFIX" ] && ARGS_END_VARIABLE_PREFIX="ARG_END"
  fi
fi

#-------------------------------------------------------------------------------

args_array_set()
{
  DEFINITION="$1"
  shift
  
  DEFAULT_VARIABLE_NAME="$1"
  shift
  
  DEFAULT_FUNCTION_NAME="$1"
  shift
  
  DEFAULT_LOOP_FUNCTION_NAME="$1"
  shift
  
  TERMINATOR="$1"
  shift
  
  eval "ARRAY_NAME=\"\$${DEFINITION}_VARIABLE\""
  [ -z "$ARRAY_NAME" ] && ARRAY_NAME="$DEFAULT_VARIABLE_NAME"
  
  TERMINATOR_CHECK='case "$1" in $TERMINATOR) false;; *) true;; esac'
  eval "n=\"\$$DEFINITION\""
  [ "$n" = "${n#<}" ] && [ "$((n))" -ge "0" ] && TERMINATOR_CHECK="true"
  [ -z "$TERMINATOR" ] && TERMINATOR_CHECK="true"
  n="${n#<}"
  eval "n=\"\$((n))\""
  [ "$n" -lt "0" ] && n="$#"
  i="0"
  while [ "$i" -lt "$n" ] && eval "$TERMINATOR_CHECK"
  do
    set -- "$@" "$1"
    shift
    i="$((i + 1))"
  done
  n="$i"
  shift "$(($# - i))"
  
#  eval "$ARRAY_NAME=\"\$ARGS_SWITCH_ON\""
  eval "$ARRAY_NAME=\"\$*\""
  
  array_set "$ARRAY_NAME" "$@"
  
  eval "k=\"\$${DEFINITION}_FUNCTION\""
  [ -z "$k" ] && k="$DEFAULT_FUNCTION_NAME"
  
  if [ -n "$k" ]
  then
    if type "$k">/dev/null 2>&1
    then
      $k "$@"
#    else
#      log_fatal "requested function name does not exist: $k"
#      exit 1
    fi
  fi
  
  i="0"
  while [ "$i" -lt "$n" ]
  do
    eval "k=\"${DEFINITION}_VARIABLE\"" && eval "k=\"\$${k}_$i\""
    [ -n "$k" ] && eval "$k=\"\$${ARRAY_NAME}_$i\""
    
    eval "k=\"${DEFINITION}_FUNCTION\"" && eval "k=\"\$${k}_$i\""
    [ -z "$k" ] && k="$DEFAULT_LOOP_FUNCTION_NAME"
    
    if [ -n "$k" ]
    then
      if type "$k">/dev/null 2>&1
      then
        eval "$k \"\$${ARRAY_NAME}_$i\""
#      else
#        log_fatal "requested function name does not exist: $k"
#        exit 1
      fi
    fi
    
    i="$((i + 1))"
  done
  
  unset DEFINITION
  unset ARRAY_NAME
  unset DEFAULT_VARIABLE_NAME
  unset DEFAULT_FUNCTION_NAME
  unset TERMINATOR
  
  ARGS_SHIFT="$i"
}

#-------------------------------------------------------------------------------

args_array_set_option()
{
  o="${1#--}"
  shift
  
  if [ "$o" = "help" ] || [ "$o" = "info" ] || [ "$o" = "version" ]
  then
    "args_$o"
  fi
  
  while [ "$o" != "${o#*-}" ]
  do
    o="${o%%-*}_${o#*-}"
  done
  log_trace "args_array_parse_option - determined option safe name: $o"
  
  args_array_set "ARGS_OPTION_$o" "ARG_OPTION_$o" "${ARGS_OPTION_FUNCTION_PREFIX}_$o" "" "--*" "$@"
  
  ARGS_SHIFT="$((ARGS_SHIFT + 1))"
}

#-------------------------------------------------------------------------------

args_help()
{
  echo
  (args_version)
  echo
  
#  cat "$DOC_DIR/format_$ARGS_FORMAT"
  eval echo "\$ARGS_DOC_FORMAT_$ARGS_FORMAT"
  echo
  
  if [ -f "$DOC_DIR/description" ]
  then
    echo "DESCRIPTION:"
    cat "$DOC_DIR/description"
    echo
  fi
  
  if [ -n "$ARGS_FIXED" ]
  then
    echo "FIXED: $ARGS_FIXED"
    if [ -f "$DOC_DIR/fixed" ]
    then
      cat "$DOC_DIR/fixed"
    else
      echo "UNDOCUMENTED"
    fi
    echo
  fi
  
  if [ -n "$ARGS_SWITCH" ]
  then
    echo "SWITCH:"
    r="$ARGS_SWITCH"
    k="${r%${r#?}}"
    while [ -n "$k" ]
    do
      if [ -f "$DOC_DIR/description" ]
      then
        echo "$k: $(cat "$DOC_DIR/switch_$k")"
      else
        echo "$k: UNDOCUMENTED"
      fi
      
      r="${r#?}"
      k="${r%${r#?}}"
    done
    echo
  fi
  
  if [ -n "$ARGS_OPTION" ]
  then
    echo "OPTION:"
    for k in $ARGS_OPTION
    do
      if [ -f "$DOC_DIR/option_$k" ]
      then
        eval echo "$k - \$ARGS_OPTION_$k: $(cat "$DOC_DIR/option_$k")"
      else
        eval echo "$k - \$ARGS_OPTION_$k: UNDOCUMENTED"
      fi
    done
    echo
  fi
  
  if [ -n "$ARGS_START" ]
  then
    echo "START: $ARGS_START"
    if [ -f "$DOC_DIR/start" ]
    then
      cat "$DOC_DIR/fixed"
    else
      echo "UNDOCUMENTED"
    fi
    echo
  fi
  
  echo "ARGUMENTS:"
  if [ -f "$DOC_DIR/fixed" ]
  then
    cat "$DOC_DIR/args"
  else
    echo "UNDOCUMENTED"
  fi
  echo
  
  if [ -n "$ARGS_END" ]
  then
    echo "END: $ARGS_END"
    if [ -f "$DOC_DIR/fixed" ]
    then
      cat "$DOC_DIR/end"
    else
      echo "UNDOCUMENTED"
    fi
    echo
  fi
  
  if [ -f "$DOC_DIR/examples" ]
  then
    echo "EXAMPLES:"
    cat "$DOC_DIR/examples"
    echo
  fi
  
  if [ -f "$DOC_DIR/conclusion" ]
  then
    echo "CONCLUSION:"
    cat "$DOC_DIR/conclusion"
    echo
  fi
  
  echo
  
  exit 0
}

#-------------------------------------------------------------------------------

args_info()
{
  args_help | less
  
  exit 0
}

#-------------------------------------------------------------------------------

args_version()
{
  echo "$(cat "${THIS_DIR%/*}/sys/name")/$(cat "${THIS_DIR%/*}/sys/platform")/$(cat "${THIS_DIR%/*}/sys/version")"
#  cat "${THIS_DIR%/*}/sys/name"
#  cat "${THIS_DIR%/*}/sys/platform"
#  cat "${THIS_DIR%/*}/sys/version"
  exit 0
}

#-------------------------------------------------------------------------------

args_parse()
{
  if [ "$ARGS_PARSE" = "true" ]
  then
    case "$ARGS_FORMAT" in
      "easy") true;;
      "smart") true;;
      "strict") true;;
      *) exit 1;;
    esac
    trace call exit args_parse_format_$ARGS_FORMAT "$@"
  else
    trace exec return main "$@"
  fi
}

#-------------------------------------------------------------------------------

args_parse_format_easy()
{
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
  
  trace exec return main "$@"
}

#-------------------------------------------------------------------------------

args_parse_format_smart()
{
  if [ "$1" = "--help" ] || [ "$1" = "--info" ] || [ "$1" = "--version" ]
  then
    "args_${1#--}"
  fi
  
  if [ -n "$ARGS_FIXED" ]
  then
    args_array_set "ARGS_FIXED" "ARG_FIXED" "" "" "" "$@"
    shift "$ARGS_SHIFT"
  fi
  
  args_parse_switch_defaults
  
  COUNT="0"
  TOTAL="$#"
  MOVED="0"
  log_trace "TOTAL: $TOTAL"
  while [ "$COUNT" -lt "$TOTAL" ]
  do
    if [ "$1" = "--" ]
    then
      shift
      log_debug "detected terminator -- remaining args: $@"
      break
    elif [ "$1" != "${1#--}" ]
    then
      log_debug "detected option: $1"
      args_array_set_option "$@"
      shift "$ARGS_SHIFT"
      COUNT="$((COUNT + ARGS_SHIFT))"
      log_trace "parse_option - managed $ARGS_SHIFT arguments as an option - remaining args: $@"
    elif [ "$1" != "${1#-?}" ]
    then
      log_debug "detected switches: $1"
      args_parse_switch "$1" "$ARGS_SWITCH"
      shift
      COUNT="$((COUNT + 1))"
    else
      set -- "$@" "$1"
      shift
      COUNT="$((COUNT + 1))"
      MOVED="$((MOVED + 1))"
    fi
  done
  
  COUNT="$(($# - MOVED))"
  while [ "$COUNT" -gt "0" ]
  do
    set -- "$@" "$1"
    shift
    COUNT="$((COUNT - 1))"
  done
  
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
  
  trace exec return main "$@"
}

#-------------------------------------------------------------------------------

args_parse_format_strict()
{
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
  
  trace exec return main "$@"
}

#-------------------------------------------------------------------------------

args_parse_switch_defaults()
{
  if [ -n "$ARGS_SWITCH_OFF" ]
  then
    r="$ARGS_SWITCH"
    k="${r%${r#?}}"
    while [ -n "$k" ]
    do
      log_trace "setting default off for switch: $k"
      eval "${ARGS_SWITCH_VARIABLE_PREFIX}_$k=\"$ARGS_SWITCH_OFF\""
      eval k="\$ARGS_SWITCH_$k"
      [ -n "$k" ] && eval "$k=\"$ARGS_SWITCH_OFF\""
      
      r="${r#?}"
      k="${r%${r#?}}"
    done
    
    unset r
    unset k
    
    for k in $ARGS_OPTION
    do
      log_trace "setting default off for option: $k"
      while [ "$k" != "${k#*-}" ]
      do
        k="${k%%-*}_${k#*-}"
      done
      eval "${ARGS_OPTION_VARIABLE_PREFIX}_${k}=\"$ARGS_SWITCH_OFF\""
      eval "k=\"ARGS_OPTION_${k}_$OPT_COUNT\""
      eval "[ -n \"\$$k\" ] && eval \$$k=\"$ARGS_SWITCH_OFF\""
    done
  fi
}

#-------------------------------------------------------------------------------

args_parse_switch()
{
  if [ -z "$ARGS_SWITCH" ]
  then
    log_fatal "switches not allowed - provided: $@"
#    return 1
    exit 1
  fi
  
  r="${1#-}"
  k="${r%${r#?}}"
  while [ -n "$k" ]
  do
    if [ "$ARGS_SWITCH" != "${ARGS_SWITCH#*$k}" ] || [ "$ARGS_SWITCH" = "*" ]
    then
      if type "${ARGS_SWITCH_FUNCTION_PREFIX}_$k">/dev/null 2>&1
      then
        log_trace "parse_switch - managing switch: ${ARGS_SWITCH_FUNCTION_PREFIX}_$k"
        "${ARGS_SWITCH_FUNCTION_PREFIX}_$k"
      fi
# todo put env setting before, but be aware of var k manipulation
      eval "${ARGS_SWITCH_VARIABLE_PREFIX}_$k=\"$ARGS_SWITCH_ON\""
      eval k="\$ARGS_SWITCH_$k"
      [ -n "$k" ] && eval "$k=\"$ARGS_SWITCH_ON\""
    else
      if type "${ARGS_SWITCH_FUNCTION_PREFIX}_error">/dev/null 2>&1
      then
        log_error "parse_switch - unmanaged switch - calling error function: ${ARGS_SWITCH_FUNCTION_PREFIX}_error $k"
        "${ARGS_SWITCH_FUNCTION_PREFIX}_error" "$k"
      else
        log_fatal "unmanaged switch: $k"
        unset r
        unset k
#        return 1
        exit 1
      fi
    fi
    r="${r#?}"
    k="${r%${r#?}}"
  done
  
  unset r
  unset k
}

#-------------------------------------------------------------------------------

parse_switch()
{
  r="${1#-}"
  k="${r%${r#?}}"
  while [ -n "$k" ]
  do
    if [ -z "$2" ] || [ "${2#*$k}" != "$2" ]
    then
      if type "parse_switch_$k">/dev/null 2>&1
      then
        log_trace "parse_switch - managing switch: parse_switch_$k"
        "parse_switch_$k"
      else
        log_trace "parse_switch - automatic switch variable: PARSE_SWITCH_$k = true"
        eval "PARSE_SWITCH_$k=\"true\""
      fi
    else
      if type "parse_switch_error">/dev/null 2>&1
      then
        log_error "parse_switch - unmanaged switch - calling error function: parse_switch_error $k"
        "parse_switch_error" "$k"
      else
        log_error "unmanaged free switch: $k"
      fi
    fi
    r="${r#?}"
    k="${r%${r#?}}"
  done
}

#-------------------------------------------------------------------------------

parse_option()
{
  o="${1#--}"
  shift
  
  if [ "$o" = "${o#*=}" ]
  then
    OPT_COUNT="0"
    OPT_TOTAL="$#"
    while [ "$OPT_COUNT" -lt "$OPT_TOTAL" ] && [ "$1" = "${1#--}" ]
    do
      set -- "$@" "$1"
      OPT_COUNT="$((OPT_COUNT + 1))"
      shift
    done
    
    shift "$(($# - OPT_COUNT))"
  else
    OPT_COUNT="0"
    p="${o#*=}"
# replace eval or clean params
    eval set -- "$p"
    o="${o%%=*}"
  fi
  
  while [ "$o" != "${o#*-}" ]
  do
    o="${o%%-*}_${o#*-}"
  done
  log_trace "parse_option - determined option function name: parse_option_$o"
  
  if type "parse_option_$o">/dev/null 2>&1
  then
    log_trace "parse_option - managing option: parse_option_$o $@"
    "parse_option_$o" "$@"
    [ "$?" != "0" ] && log_trace "parse_option - error setting option parameters"
  elif type "parse_option_error">/dev/null 2>&1
  then
    "parse_option_error" "$o" "$@"
    log_error "parse_option - unmanaged option"
  else
    log_error "parse_option - unregistered error handler"
  fi
  
  return "$((OPT_COUNT + 1))"
}

#-------------------------------------------------------------------------------
