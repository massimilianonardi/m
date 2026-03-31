#!/bin/sh

#------------------------------------------------------------------------------

# encodes stdin to stdout (password can be provided through environmental variable OPENSSL_PASS)

encode()
{
  if [ -z "$OPENSSL_PASS" ]
  then
    openssl enc -e -aes-256-cbc -pbkdf2
  else
    openssl enc -e -aes-256-cbc -pbkdf2 -pass "env:OPENSSL_PASS"
  fi
}

#------------------------------------------------------------------------------

# decodes stdin to stdout (password can be provided through environmental variable OPENSSL_PASS)

decode()
{
  if [ -z "$OPENSSL_PASS" ]
  then
    openssl enc -d -aes-256-cbc -pbkdf2
  else
    openssl enc -d -aes-256-cbc -pbkdf2 -pass "env:OPENSSL_PASS"
  fi
}

#------------------------------------------------------------------------------

# decodes file sourcing (executing) it into current shell script

encoded_file_import()
{
  if [ ! -f "$1" ]
  then
    set -- "$(command -v "$1")"

    if [ "$?" != "0" ] || [ ! -f "$1" ]
    then
      return 1
    fi
  fi

  eval "$(decode < "$1")"
}

#------------------------------------------------------------------------------

# decodes file, opens it in editor, re-encodes it streaming into original

encoded_file_edit()
{
  if [ ! -f "$1" ]
  then
    set -- "$(command -v "$1")"

    if [ "$?" != "0" ] || [ ! -f "$1" ]
    then
      return 1
    fi
  fi

  (
    DECODED_FILE="${1}.$(date +"[%Y-%m-%d %H:%M:%S]").dec" && \
    decode < "$1" > "$DECODED_FILE" && \
    nano "$DECODED_FILE" && \
    encode < "$DECODED_FILE" > "$1" && \
    rm -f "$DECODED_FILE"
  )
}

#------------------------------------------------------------------------------

# convert string from ascii to octal

a2o()
{
  if [ -z "$*" ]
  then
    od -A n -b | tr -d '\t\r\n'
  else
    while [ "$#" -gt "0" ]
    do
      printf "$1" | od -A n -b | tr -d '\t\r\n'
      shift
    done
  fi
}

# convert string from octal to ascii

o2a()
{
  if [ -z "$*" ]
  then
    set -- $(cat)
    # tr ' ' '\n' | xargs -I % printf "\\%"
  elif [ "$#" = "1" ]
  then
    set -- $@
  fi

  while [ "$#" -gt "0" ]
  do
    printf "\\$1"
    shift
  done
}

#-------------------------------------------------------------------------------
