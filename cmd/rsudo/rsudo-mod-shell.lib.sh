#!/bin/sh

log_info "RSUDO SHELL - START"

(
  shift
  rsudoenv load "$@"

  if [ "$?" != "0" ]
  then
    log_error "RSUDO SHELL - some files could not be loaded"
  fi

  bash --init-file "$(command -v "rsudo-env.lib.sh")"
  # bash
  # exec < /dev/tty
  # exec bash --init-file "$(command -v "rsudo.lib.sh")"
  # sudo su
)

log_info "RSUDO SHELL - END"
