#!/bin/sh

cd $(dirname $0)

make -f makefile build CONF=DEBUG
