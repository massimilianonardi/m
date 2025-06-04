#!/bin/sh

#-------------------------------------------------------------------------------

. env.lib.sh
. term.lib.sh

#-------------------------------------------------------------------------------

# exist_function "env_init" || \
# env_init()
# {
#   term_region_init
#   env_defaults
#   args_init "$@"
# }

#-------------------------------------------------------------------------------

exist_function "key_loop" || \
key_loop()
{
  while true
  do
    key="$(readc)"

    if exist_function "key_${key}"
    then
      "key_${key}" || return 0
    elif exist_function "key_default"
    then
      "key_default" || return 0
    else
      term_render echo "$key has not associated any funcion, nor default funtion exists"
    fi
  done
}

#-------------------------------------------------------------------------------

main()
{
  term_region_init

  render

  [ "$KEY_LOOP" = "false" ] || key_loop
}

#-------------------------------------------------------------------------------

# main "$@"
env_main "$@"
