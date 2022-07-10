#!/bin/sh

cd $(dirname $0)

source ./config_target.sh

make -f makefile printscriptvars CONF=$CONF TARGET_CPU=$TARGET_CPU TARGET_OS=$TARGET_OS TARGET_ARCHITECTURE=$TARGET_ARCHITECTURE SYS_COMPILER=$SYS_COMPILER
