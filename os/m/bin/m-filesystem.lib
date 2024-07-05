#!/bin/sh

#-------------------------------------------------------------------------------

lnr()
(
  TARGET="$1"
  NAME="$2"
  [ -z "$TARGET" ] && exit 1
  [ -z "$NAME" ] && exit 1
  if [ -f "$NAME" ] || [ -d "$NAME" ]; then log_fatal "link cannot replace existing file or directory: $NAME"; exit 1; fi
  
  DEST_DIR="$(dirname "$NAME")"
  [ ! -d "$DEST_DIR" ] && mkdir -p "$DEST_DIR"
#  ln -fs "$(realpath --relative-to="$DEST_DIR" "$TARGET")" "$NAME"
  ln -fs "$(path -- "$TARGET" "$DEST_DIR")" "$NAME"
)

#-------------------------------------------------------------------------------

lna()
(
  TARGET="$1"
  NAME="$2"
  [ -z "$TARGET" ] && exit 1
  [ -z "$NAME" ] && exit 1
  if [ -f "$NAME" ] || [ -d "$NAME" ]; then log_fatal "link cannot replace existing file or directory: $NAME"; exit 1; fi
  
  DEST_DIR="$(dirname "$NAME")"
  [ ! -d "$DEST_DIR" ] && mkdir -p "$DEST_DIR"
  ln -fs "$TARGET" "$NAME"
)

#-------------------------------------------------------------------------------

lnk_()
(
  if [ "$LINK_RELATIVE" = "true" ]
  then
    lnr "$1" "$2" || exit "$?"
  else
    lna "$1" "$2" || exit "$?"
  fi
)

#-------------------------------------------------------------------------------

cpr()
(
  TARGET="$1"
  NAME="$2"
  [ -z "$TARGET" ] && exit 1
  [ -z "$NAME" ] && exit 1
  [ -f "$TARGET" ] && [ -d "$NAME" ] && exit 1
  
  DEST_DIR="$(dirname "$NAME")"
  [ ! -d "$DEST_DIR" ] && mkdir -p "$DEST_DIR"
  [ -d "$NAME" ] && NAME="$DEST_DIR"
  cp -R -L -f "$TARGET" "$NAME"
)

#-------------------------------------------------------------------------------

cpd()
(
  [ "$#" -lt "2" ] && exit 1
  
#  eval 'DEST_DIR="${'$#'}"'
  
  COUNT="1"
  for k in "$@"
  do
    [ "$((COUNT))" -lt "$#" ] && set -- "$@" "$k" || DEST_DIR="$k"
    shift
    COUNT="$((COUNT + 1))"
  done
  
  [ ! -d "$DEST_DIR" ] && mkdir -p "$DEST_DIR"
  cp -R -L -f "$@" "$DEST_DIR"
)

#-------------------------------------------------------------------------------

imp()
(
  if [ "$HOTSEEX" = "true" ]
  then
#    lnk_ "$1" "$2" || exit "$?"
    lnk -cfr "$1" "$2" || exit "$?"
  else
#    cpr "$1" "$2" || exit "$?"
    copy -acf "$1" "$2" || exit "$?"
  fi
)

#-------------------------------------------------------------------------------

___impdeep()
(
log_warn "___impdeep"
  cd "$1"
  for k in ..?* .[!.]* *
  do
    [ -e "$k" ] || [ -f "$k" ] || [ -d "$k" ] || [ -L "$k" ] || continue
    [ -L "$k" ] && log_warn "copy $1/$k $2/$k" && cp -av "$1/$k" "$2/$k" && continue
    imp "$1/$k" "$2/$k" || ___impdeep "$1/$k" "$2/$k" || exit "$?"
  done
)

impdeep()
(
  HOTSEEX_LEVEL="$((HOTSEEX_LEVEL))"
  if [ -f "$1" ] || [ "$(($3))" -eq "$(($HOTSEEX_LEVEL))" ]
  then
#    imp "$1" "$2" || exit "$?"
# if fails then is probably a dir, then try to import what inside such dir (as if it has temporarily increased hotseex level)
    imp "$1" "$2" || ___impdeep "$1" "$2" || exit "$?"
  elif [ -d "$1" ] && [ "$(($3))" -lt "$(($HOTSEEX_LEVEL))" -o "$HOTSEEX_LEVEL" = "-1" -o "$HOTSEEX_LEVEL" = "inf" ]
  then
    mkdir -p "$2"
    [ "$2" = "${2#/}" ] && set -- "$1" "$(pwd)/${2#./}" "$3"
    set -- "$1" "$2" "$(($3 + 1))"
    cd "$1"
    for k in ..?* .[!.]* *
    do
      [ -e "$k" ] || continue
      impdeep "$1/$k" "$2/$k" "$3" || exit "$?"
    done
  elif [ -d "$1" ]
  then
    imp "$1" "$2" || exit "$?"
  else
    echo "impdeep: unknown error">&2
  fi
)

#-------------------------------------------------------------------------------

newer()
(
  [ "$#" -lt "2" ] && exit 2
  [ ! -d "$2" ] && exit 3
  
  [ ! -f "$1" ] && exit 0
  
  for k in $(find "$2" -newer "$1" -print)
  do
    exit 0
  done
  
  exit 1
)

#-------------------------------------------------------------------------------

fnd___()
(
  if [ -f "$1" ]
  then
    eval "$2 \"\$k\""
  fi
  
  fnd_loop___ "$@"
#  cd -P -- "$1"
#  [ $# -lt 3 ] || [ "$PWD" = "$3" ] || exit 1
#  for k in ..?* .[!.]* *
#  do
#    [ -e "$k" ] && eval "$2 \"\$k\""
#    [ -d "$k" ] && fnd "$k" "$2" "${PWD%/}/$k"
#  done
)

#-------------------------------------------------------------------------------

fnd_loop___()
(
  cd -P -- "$1"
  [ $# -lt 3 ] || [ "$PWD" = "$3" ] || exit 1
  for i in ..?* .[!.]* *
  do
    [ -e "$i" ] && eval "$2 \"\$i\""
    [ -L "$i" ] && eval "$2 \"\$i\""
    [ -d "$i" ] && fnd_loop___ "$i" "$2" "${PWD%/}/$i"
  done
)

#-------------------------------------------------------------------------------

fnd()
(
  [ "$#" -lt "2" ] && exit 2
  [ ! -d "$1" ] && exit 3
  
  FIND_DIR="$(path -al "$1")"
  shift
  
  fnd_loop "$FIND_DIR" "$@"
)

#-------------------------------------------------------------------------------

fnd_loop()
(
  [ -z "$1" ] && exit 2
  
  FIND_DIR="$1"
  shift
  
  for k in "$FIND_DIR"/..?* "$FIND_DIR"/.[!.]* "$FIND_DIR"/*
  do
# todo if option to follow links if -L then resolve, if dir then loop, if file then exec
    if [ -e "$k" ] || [ -L "$k" ]
    then
      "$@" "$k"
    fi
    
    if [ -d "$k" ]
    then
      fnd_loop "$k" "$@"
    fi
  done
)

#-------------------------------------------------------------------------------

fnd_loop_()
(
  [ -z "$1" ] && exit 2
  
  FIND_DIR="$1"
  shift
  
  for k in "$FIND_DIR"/..?* "$FIND_DIR"/.[!.]* "$FIND_DIR"/*
  do
    if [ "$k" = "$FIND_DIR/..?*" ] || [ "$k" = "$FIND_DIR/.[!.]*" ] || [ "$k" = "$FIND_DIR/*" ]
    then
echo BAD "$k"
      continue
    else
echo EXEC "$k"
      echo "$@" "$k"
    fi
    
    if [ -d "$k" ]
    then
echo LOOP "$k"
      fnd_loop "$k" "$@"
    fi
  done
)

#-------------------------------------------------------------------------------
