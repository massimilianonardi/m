#!/bin/sh

cd $(dirname $0)
cd ../makefiles

make -f makefile clean_all
