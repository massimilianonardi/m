#!/bin/sh

waituser()
{
  # EXIT_CODE="$?"

  # detect if launched from gui or active terminal
  PARENT_PROCESS="$(ps -o 'cmd=' -p $(ps -o 'ppid=' -p $$))"
  #if [ "$PARENT_PROCESS" != "bash" ]
  if [ "${PARENT_PROCESS%sh}" = "$PARENT_PROCESS" ]
  then
    echo ""
    # echo "--------------------------------------------------------------------------------"
    # echo "EXIT_CODE=$EXIT_CODE"
    echo "--------------------------------------------------------------------------------"
    read -p "press ENTER to exit" EXIT_VAR
  fi

  exit "$EXIT_CODE"
}
