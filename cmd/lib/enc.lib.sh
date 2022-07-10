#!/bin/sh

#------------------------------------------------------------------------------

file_enc()
{
  if [ ! -f "$1" ]
  then
    return 1
  fi

  if [ -z "$OPENSSL_PASS" ]
  then
    eval "$(openssl enc -e -aes-256-cbc -pbkdf2 -in "$1" -out "$1".enc)"
  else
    eval "$(openssl enc -e -aes-256-cbc -pbkdf2 -in "$1" -out "$1".enc -pass "env:OPENSSL_PASS")"
  fi
}

#------------------------------------------------------------------------------

file_dec()
{
  if [ ! -f "$1" ]
  then
    return 1
  fi

  if [ -z "$OPENSSL_PASS" ]
  then
    eval "$(openssl enc -d -aes-256-cbc -pbkdf2 -in "$1" -out "$1".dec)"
  else
    eval "$(openssl enc -d -aes-256-cbc -pbkdf2 -in "$1" -out "$1".dec -pass "env:OPENSSL_PASS")"
  fi
}

#------------------------------------------------------------------------------

import_enc()
{
  if [ ! -f "$1" ]
  then
    set -- "$(command -v "$1")"
  fi

  echo "importing encoded file: $1"
  if [ -z "$OPENSSL_PASS" ]
  then
    eval "$(openssl enc -d -aes-256-cbc -pbkdf2 -in "$1")"
  else
    eval "$(openssl enc -d -aes-256-cbc -pbkdf2 -in "$1" -pass "env:OPENSSL_PASS")"
  fi
}

#------------------------------------------------------------------------------

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
