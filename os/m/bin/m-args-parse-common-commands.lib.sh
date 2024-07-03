#!/bin/sh

#-------------------------------------------------------------------------------

DOC_DIR="${THIS_DIR%/*}/doc/$THIS_NAME"
if [ -d "$DOC_DIR/$LANG" ]
then
  DOC_DIR="$DOC_DIR/$LANG"
elif [ -d "$DOC_DIR/$LANG_DEF" ]
then
  DOC_DIR="$DOC_DIR/$LANG_DEF"
fi

#-------------------------------------------------------------------------------

args_version()
{
  echo "$(cat "${THIS_DIR%/*}/sys/name")/$(cat "${THIS_DIR%/*}/sys/platform")/$(cat "${THIS_DIR%/*}/sys/version")"
#  cat "${THIS_DIR%/*}/sys/name"
#  cat "${THIS_DIR%/*}/sys/platform"
#  cat "${THIS_DIR%/*}/sys/version"
}

#-------------------------------------------------------------------------------

args_help()
{
  echo
  (args_version)
  echo

#  cat "$DOC_DIR/format_$ARGS_FORMAT"
  eval echo "\$ARGS_DOC_FORMAT_$ARGS_FORMAT"
  echo

  if [ -f "$DOC_DIR/description" ]
  then
    echo "DESCRIPTION:"
    cat "$DOC_DIR/description"
    echo
  fi

  if [ -n "$ARGS_FIXED" ]
  then
    echo "FIXED: $ARGS_FIXED"
    if [ -f "$DOC_DIR/fixed" ]
    then
      cat "$DOC_DIR/fixed"
    else
      echo "UNDOCUMENTED"
    fi
    echo
  fi

  if [ -n "$ARGS_SWITCH" ]
  then
    echo "SWITCH:"
    r="$ARGS_SWITCH"
    k="${r%${r#?}}"
    while [ -n "$k" ]
    do
      if [ -f "$DOC_DIR/description" ]
      then
        echo "$k: $(cat "$DOC_DIR/switch_$k")"
      else
        echo "$k: UNDOCUMENTED"
      fi

      r="${r#?}"
      k="${r%${r#?}}"
    done
    echo
  fi

  if [ -n "$ARGS_OPTION" ]
  then
    echo "OPTION:"
    for k in $ARGS_OPTION
    do
      if [ -f "$DOC_DIR/option_$k" ]
      then
        eval echo "$k - \$ARGS_OPTION_$k: $(cat "$DOC_DIR/option_$k")"
      else
        eval echo "$k - \$ARGS_OPTION_$k: UNDOCUMENTED"
      fi
    done
    echo
  fi

  if [ -n "$ARGS_START" ]
  then
    echo "START: $ARGS_START"
    if [ -f "$DOC_DIR/start" ]
    then
      cat "$DOC_DIR/fixed"
    else
      echo "UNDOCUMENTED"
    fi
    echo
  fi

  echo "ARGUMENTS:"
  if [ -f "$DOC_DIR/fixed" ]
  then
    cat "$DOC_DIR/args"
  else
    echo "UNDOCUMENTED"
  fi
  echo

  if [ -n "$ARGS_END" ]
  then
    echo "END: $ARGS_END"
    if [ -f "$DOC_DIR/fixed" ]
    then
      cat "$DOC_DIR/end"
    else
      echo "UNDOCUMENTED"
    fi
    echo
  fi

  if [ -f "$DOC_DIR/examples" ]
  then
    echo "EXAMPLES:"
    cat "$DOC_DIR/examples"
    echo
  fi

  if [ -f "$DOC_DIR/conclusion" ]
  then
    echo "CONCLUSION:"
    cat "$DOC_DIR/conclusion"
    echo
  fi

  echo
}

#-------------------------------------------------------------------------------

args_info()
{
  args_help | less
}

#-------------------------------------------------------------------------------
