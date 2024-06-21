#!/bin/sh

#-------------------------------------------------------------------------------

export M_OS="MASSIMILIANO_NARDI"
export M_OS_VER="0"
export MASSIMILIANO_NARDI="MASSIMILIANO_NARDI"

#-------------------------------------------------------------------------------

m_this()
{
  THIS_DIR="$(cd -P -- "${0%/*}"; pwd)"
  THIS_NAME="${0##*/}"
  THIS_PATH="$THIS_DIR/$THIS_NAME"
}

#-------------------------------------------------------------------------------

m_include()
{
  INCLUDE_DIR="$THIS_DIR/include"

  if [ -d "$INCLUDE_DIR" ]
  then
    log_debug "INCLUDE_DIR: $INCLUDE_DIR"
    for k in "$INCLUDE_DIR"/*
    do
      [ -d "$k" ] && log_trace "INCLUDE_FILE is a directory: $k" && continue
      log_trace "INCLUDE_FILE: $k"
      . "$k"
    done
  fi

  if [ -d "$INCLUDE_DIR/$THIS_NAME" ]
  then
    log_debug "INCLUDE_DIR: $INCLUDE_DIR/$THIS_NAME"
    for k in "$INCLUDE_DIR/$THIS_NAME"/*
    do
      log_trace "INCLUDE_FILE: $k"
      . "$k"
    done
  fi
}

#-------------------------------------------------------------------------------

m_conf_local()
{
  if [ -f "$THIS_PATH.conf" ]
  then
    log_debug "CONF_FILE: $THIS_PATH.conf"
    . "$THIS_PATH.conf"
  fi
}

#-------------------------------------------------------------------------------

m_conf_sys()
{
  . m-sys.lib.sh
  . m-init.lib.sh

  if [ "$M_CONTEXT" != "m_os" ]
  then
    log_fatal "this script need to be executed within an m-os context - M_CONTEXT: $M_CONTEXT"
    exit 1
  fi

  THIS_PACKAGE="${THIS_DIR%/bin}"
  if [ -f "$THIS_PACKAGE/sys/name" ]
  then
    THIS_PACKAGE="$(cat "$THIS_PACKAGE/sys/name")"
  else
    THIS_PACKAGE="${THIS_PACKAGE##*/}"
  fi
#  work "$THIS_NAME"
  work "$THIS_PACKAGE"

  if [ -f "$CONF_DIR/$THIS_PACKAGE.conf" ]
  then
    log_debug "CONF_FILE: $CONF_DIR/$THIS_PACKAGE.conf"
    . "$CONF_DIR/$THIS_PACKAGE.conf"
  fi

  if [ -f "$CONF_DIR/$THIS_NAME.conf" ]
  then
    log_debug "CONF_FILE: $CONF_DIR/$THIS_NAME.conf"
    . "$CONF_DIR/$THIS_NAME.conf"
  fi
}

#-------------------------------------------------------------------------------

m_script___()
{
  m_this

  m_start "$@"

  m_include

  m_conf_local
  m_conf_sys

  . m-filesystem.lib.sh
  . m-var.lib.sh

  m_end "$@"
}

#-------------------------------------------------------------------------------

m_command()
{
  true
}

m_script()
{
  true
}

#-------------------------------------------------------------------------------

THIS_DIR="$(cd -P -- "${0%/*}"; pwd)"
THIS_NAME="${0##*/}"
THIS_PATH="$THIS_DIR/$THIS_NAME"

. m-log.lib.sh

log_info "********************************************************************************"
log_info "[START] $THIS_NAME" "$@"
log_debug "[THIS_DIR] $THIS_DIR [PWD] $PWD"

if [ "$ARGS_PARSE" = "true" ]
then
  . m-args-parse.lib.sh
fi

trace exec return main "$@"
EXIT_CODE="$?"
[ "$EXIT_CODE" -eq "0" ] || log_error "EXIT_CODE: $EXIT_CODE"

log_info "[END $EXIT_CODE] $THIS_NAME" "$@"
log_info "********************************************************************************"

exit "$EXIT_CODE"
