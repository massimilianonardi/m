#!/bin/sh

#INIT_DIR="$(command -v "m.lib.sh")"
INIT_DIR="$(command -v "shell")"
INIT_DIR="${INIT_DIR%/*}"
INIT_DIR="$(cd -L -- "$INIT_DIR" && pwd -L)"
export INIT_DIR

if [ -z "$ROOT_DIR" ]
then
  if [ "$INIT_DIR" != "${INIT_DIR%/pkg/*}" ]
  then
    ROOT_DIR="${INIT_DIR%/pkg/m/bin}"
    M_CONTEXT="m_os"
    sys_root "$ROOT_DIR"
    work
    #user "$SYS_SYSTEM_USER"
    #user "$SYS_PORTABLE_USER"
    user
    [ -f "$ENV_FILE" ] && . "$ENV_FILE"
#    [ -f "$PATH_FILE" ] && . "$PATH_FILE"
    log_debug "root from pkg - init: $INIT_DIR - root: $ROOT_DIR - src: $SRC_DIR"
  elif [ "$INIT_DIR" != "${INIT_DIR%/src/os/m/bin}" ]
  then
    ROOT_DIR="${INIT_DIR%/src/*}"
    M_CONTEXT="m_source"
    SRC_DIR="$ROOT_DIR"
    ROOT_DIR="${ROOT_DIR%/*}"
    log_debug "root from src - init: $INIT_DIR - root: $ROOT_DIR - src: $SRC_DIR"
  else
    M_CONTEXT="standalone"
    log_fatal "root not from pkg or src - init: $INIT_DIR - root: $ROOT_DIR - src: $SRC_DIR"
    exit 1
  fi
  export M_CONTEXT
  export ROOT_DIR
  export SRC_DIR
elif [ -z "$M_CONTEXT" ] || [ -z "$M_OS" ] || [ -z "$M_OS_VER" ] || [ -z "$MASSIMILIANO_NARDI" ]
then
  log_fatal "ROOT_DIR variable is must be managed solely by m-os"
  exit 1
fi
