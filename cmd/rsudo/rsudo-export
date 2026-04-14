#!/bin/sh

. log.lib.sh

#------------------------------------------------------------------------------

#-------------------------------------------------------------------------------

echo "$@"

while [ "$1" != "--" ] && [ "$#" -gt "0" ]
do
  EXPORT_VARS="$EXPORT_VARS $1=\$$1"
  shift
done
shift

echo "EXPORT_VARS=$EXPORT_VARS"
# rsudo $EXPORT_VARS "$@"
echo "$EXPORT_VARS $@" | rsudo
