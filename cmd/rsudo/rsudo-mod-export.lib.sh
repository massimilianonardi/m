#!/bin/sh

. log.lib.sh

#------------------------------------------------------------------------------

log_debug "rsudo-export args: $@"
if [ -z "$1" ]
then
  log_fatal "env vars list is empty!"
fi

EXPORT_VARS="$(env_return set "$1")"
shift

# rsudo eval $EXPORT_VARS "$@"
if [ -t 0 ]
then
  log_debug "rsudo-export: terminal attached"
  # rsudo "$EXPORT_VARS" "$@"
  rsudo eval $EXPORT_VARS "$@"
  # rsudo sh -c "$EXPORT_VARS $@"
else
  log_debug "rsudo-export: terminal NOT attached"
  rsudo eval $EXPORT_VARS "$(cat)" "$@"
  # (echo "$EXPORT_VARS"; cat) | rsudo eval "$@"
fi

#-------------------------------------------------------------------------------
