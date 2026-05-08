#!/bin/sh

. log.lib.sh

#------------------------------------------------------------------------------

rsudo_mod_apisix_test()
{
  log_debug "inside apisix"
  rsudo << 'EOF'
ADMIN_KEY_PREFIX="$(cat "/usr/local/apisix/conf/config.yaml" | sed -n "s/admin_key:.*//p")"
ADMIN_KEY="$(cat "/usr/local/apisix/conf/config.yaml" | sed "s/$ADMIN_KEY_PREFIX//" | sed -n '/admin_key:/,/^[[:lower:]]/{//!p;}' | tr '\n' '|' | sed -e 's/ //g' -e 's/.*admin|//' -e 's/|.*//' -e 's/key://')"

echo "ADMIN_KEY_PREFIX='$ADMIN_KEY_PREFIX'"
echo "ADMIN_KEY='$ADMIN_KEY'"
EOF
}

#-------------------------------------------------------------------------------

rsudo_mod_apisix_key()
{
  rsudo << 'EOF'
ADMIN_KEY_PREFIX="$(cat "/usr/local/apisix/conf/config.yaml" | sed -n "s/admin_key:.*//p")"
ADMIN_KEY="$(cat "/usr/local/apisix/conf/config.yaml" | sed "s/$ADMIN_KEY_PREFIX//" | sed -n '/admin_key:/,/^[[:lower:]]/{//!p;}' | tr '\n' '|' | sed -e 's/ //g' -e 's/.*admin|//' -e 's/|.*//' -e 's/key://')"
echo "$ADMIN_KEY"
EOF
}

rsudo_mod_apisix_keyset()
{
  if [ -z "$1" ]
  then
    log_debug "apisix_key_set: empty arg"
    return 1
  fi

  eval "$1=\"\$(rsudo_mod_apisix_key)\""
}

#-------------------------------------------------------------------------------

rsudo_mod_apisix_key()
{
  rsudo << 'EOF'
ADMIN_KEY_PREFIX="$(cat "/usr/local/apisix/conf/config.yaml" | sed -n "s/admin_key:.*//p")"
ADMIN_KEY="$(cat "/usr/local/apisix/conf/config.yaml" | sed "s/$ADMIN_KEY_PREFIX//" | sed -n '/admin_key:/,/^[[:lower:]]/{//!p;}' | tr '\n' '|' | sed -e 's/ //g' -e 's/.*admin|//' -e 's/|.*//' -e 's/key://')"
echo "$ADMIN_KEY"
EOF
}

#-------------------------------------------------------------------------------
