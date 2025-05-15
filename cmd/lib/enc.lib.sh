#!/bin/sh

  # openssl enc -e -aes-256-cbc -in un_encrypted.data -out encrypted.data
  # openssl enc -d -aes-256-cbc -in encrypted.data -out un_encrypted.data

  # unenc_file="/m/env/rpr/#webgis-deploy-include-users"
  # enc_file="/m/env/rpr/#webgis-deploy-include-users.enc"
  # unenc_file="/m/env/rpr/#postgres-servers"
  # enc_file="/m/env/rpr/#postgres-servers.enc"

  # log "encoding..."
  # openssl enc -e -aes-256-cbc -pbkdf2 -in "$unenc_file" -out "$enc_file"
  # log "decoding..."
  # openssl enc -d -aes-256-cbc -pbkdf2 -in "$enc_file" -out "$unenc_file".unenc

  # openssl enc -d -aes-256-cbc -pbkdf2 -in "$enc_file"
  # eval "$(openssl enc -d -aes-256-cbc -pbkdf2 -in "$enc_file")"
  # set | grep HOST

  # env_enc_file="rpr-env.enc"
  # env_enc_file="$(command -v "$env_enc_file")"
  # echo "env_enc_file: $env_enc_file"
  # eval "$(openssl enc -d -aes-256-cbc -pbkdf2 -in "$env_enc_file")"
  # unset env_enc_file

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
