#!/bin/sh

#-------------------------------------------------------------------------------

. env.lib.sh
. term.lib.sh

#-------------------------------------------------------------------------------

exist_function()
{
  type "$1">/dev/null 2>&1
}

#-------------------------------------------------------------------------------

env_init()
{
  term_region_init
  env_defaults
  args_init "$@"
}

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
  env_import || env_init "$@"

  render

  [ "$KEY_LOOP" = "false" ] || key_loop

  ENV_LIST="$(env_list_get)"
  env_return || (exist_function "return_res" && return_res)
}

#-------------------------------------------------------------------------------

main "$@"
