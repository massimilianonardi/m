#!/bin/sh

#-------------------------------------------------------------------------------

loop_chain()
(
  set -- $CHAIN
  CHAIN_SIZE="$#"
  shift "$((CHAIN_STEP))"
  CHAIN_TASK="$1"
  [ -n "$CHAIN_STACK" ] && CHAIN_STACK="${CHAIN_STACK}_$1" || CHAIN_STACK="$1"
  CHAIN_STEP="$((CHAIN_STEP + 1))"
  if [ "$CHAIN_STEP" -gt "$CHAIN_SIZE" ]
  then
    log_trace "chain complete"
    return 0
  fi
  
  log_trace "CHAIN_STEP=$((CHAIN_STEP))/$((CHAIN_SIZE)) - CHAIN_TASK=$CHAIN_TASK - CHAIN_STACK=$CHAIN_STACK - remaining chain tasks: $@"
  
  eval "CHAIN_VARIABLE=\"\$CHAIN_VARIABLE_$CHAIN_TASK\""
  [ -z "$CHAIN_VARIABLE" ] && CHAIN_VARIABLE="$CHAIN_VARIABLE_PREFIX$CHAIN_TASK$CHAIN_VARIABLE_SUFFIX"
  if eval "[ \"\$${CHAIN_VARIABLE}_TYPE\" != \"array\" ]"
  then
    log_trace "CHAIN_VARIABLE=$CHAIN_VARIABLE"
    LOOP_CHAIN_CMD="exec_exit loop_chain_exec $CHAIN_VARIABLE"
  else
    log_trace "CHAIN_VARIABLE=$CHAIN_VARIABLE [array]"
    LOOP_CHAIN_CMD="exec_exit array_exec $CHAIN_VARIABLE"
  fi
  
  eval "CHAIN_FUNCTION=\"\$CHAIN_FUNCTION_$CHAIN_STACK\""
  [ -z "$CHAIN_FUNCTION" ] && CHAIN_FUNCTION="$CHAIN_FUNCTION_PREFIX$CHAIN_TASK$CHAIN_FUNCTION_SUFFIX$CHAIN_GLOBAL_FUNCTION_SUFFIX"
  log_trace "CHAIN_FUNCTION=$CHAIN_FUNCTION"
  
  if exist "$CHAIN_FUNCTION"_ante && [ -z "$CHAIN_TASK_STOP" ]
  then
    $LOOP_CHAIN_CMD trace call exit "$CHAIN_FUNCTION"_ante
  fi
  
  if exist "$CHAIN_FUNCTION" && [ -z "$CHAIN_TASK_STOP" ]
  then
    $LOOP_CHAIN_CMD trace call exit "$CHAIN_FUNCTION"
  fi
  
  if exist "$CHAIN_FUNCTION"_post && [ -z "$CHAIN_TASK_STOP" ]
  then
    $LOOP_CHAIN_CMD trace call exit "$CHAIN_FUNCTION"_post
  fi
  
  eval "CHAIN_LOOP_FUNCTION=\"\$CHAIN_FUNCTION_${CHAIN_STACK}_LOOP\""
  [ -z "$CHAIN_LOOP_FUNCTION" ] && CHAIN_LOOP_FUNCTION="$CHAIN_FUNCTION_PREFIX$CHAIN_TASK$CHAIN_FUNCTION_SUFFIX$CHAIN_LOOP_FUNCTION_SUFFIX"
  log_trace "CHAIN_LOOP_FUNCTION=$CHAIN_LOOP_FUNCTION"
  
  if exist "$CHAIN_LOOP_FUNCTION" && [ -z "$CHAIN_TASK_STOP" ]
  then
    $LOOP_CHAIN_CMD trace call exit loop_chain_loop "$CHAIN_LOOP_FUNCTION"
  else
    trace exec exit loop_chain "$CHAIN_STACK"
  fi
)

#-------------------------------------------------------------------------------

loop_chain_loop()
(
  LOOP_CMD="$1"
  shift
  
  if [ -z "$*" ]
  then
    log_trace "$1: no arguments in array"
#    set -- ""
  fi
  
  for k in "$@"
  do
  (
    eval "CHAIN_LOOP_VARIABLE=\"\$CHAIN_LOOP_VARIABLE_$CHAIN_TASK\""
    [ -z "$CHAIN_LOOP_VARIABLE" ] && CHAIN_LOOP_VARIABLE="$CHAIN_LOOP_VARIABLE_PREFIX$CHAIN_VARIABLE_PREFIX$CHAIN_TASK$CHAIN_VARIABLE_SUFFIX$CHAIN_LOOP_VARIABLE_SUFFIX"
    eval "$CHAIN_LOOP_VARIABLE=\"$k\""
    
    if exist "${LOOP_CMD}_$k"_ante
    then
      trace call exit "${LOOP_CMD}_$k"_ante
    elif exist "$LOOP_CMD"_ante
    then
      trace call exit "$LOOP_CMD"_ante "$k"
    else
      log_trace "no ante functions: ${LOOP_CMD}_${k}_ante || ${LOOP_CMD}_ante"
    fi
    
#    if eval "[ \"\$CHAIN_TASK_PARAMETRIC_$CHAIN_TASK\" = \"true\" ]" && exist "${LOOP_CMD}_$k"
    if exist "${LOOP_CMD}_$k"
    then
      trace call exit "${LOOP_CMD}_$k"
    elif exist "$LOOP_CMD"
    then
      trace call exit "$LOOP_CMD" "$k"
    else
      log_trace "no core functions: ${LOOP_CMD}_$k || $LOOP_CMD"
    fi
    
    if exist "${LOOP_CMD}_$k"_post
    then
      trace call exit "${LOOP_CMD}_$k"_post
    elif exist "$LOOP_CMD"_post
    then
      trace call exit "$LOOP_CMD"_post "$k"
    else
      log_trace "no post functions: ${LOOP_CMD}_${k}_post || ${LOOP_CMD}_post"
    fi
    
    trace exec exit loop_chain "$CHAIN_STACK $k"
  ) || exit "$?"
  done
)

#-------------------------------------------------------------------------------

loop_chain_exec()
{
  eval "LOOP_EXEC_ARGS=\"\$$1\""
  shift
  "$@" $LOOP_EXEC_ARGS
}

#-------------------------------------------------------------------------------
