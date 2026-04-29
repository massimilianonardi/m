#!/bin/sh

# rsudo [args]
# rsudo -c user@host [args]
# rsudo -l file:name [args]
# rsudo [connection args] submodule [args]
#
# if not provided on command line if env vars are defined outside, then they will be used
# in any case if password is empty in interactive sessions is asked to user, if RSUDO_ASKPASS=true it is read from pipe
# if args are empty and not attached to pipe or RSUDO_INTERACTIVE=true, an interactive session is started, otherwise non interactive
# a single arg is treated as multiple command and passed to sh -c, otherwise args are treated to preserve quotes and be correctly executed without extreme escaping
# submodule is sourced allowing recursive calls to rsudo reuse env vars (not exported) of the same process

# TODO whole ps tree pid check as ssh_askpass
# TODO ssh_askpass alternative to env var (pipe, or...?)

#------------------------------------------------------------------------------

. log.lib.sh
. arg.lib.sh
. rsudo-env.lib.sh

#------------------------------------------------------------------------------

# SSH_ASKPASS command
# the following lines are executed when ssh uses "rsudo" as SSH_ASKPASS command
# maximum security is guaranteed because explicit check that caller process is ssh and
# more importantly RSUDO_PASSWORD environment variable is available only in the rsudo process tree
if [ "$(ps -o "comm=" -p "$PPID")" = "ssh" ]
then
  # RSUDO_PASSWORD="$(cat)"
  echo "$RSUDO_PASSWORD"
  log_debug "rsudo askpass called by ssh! RSUDO_PASSWORD $([ -n "$RSUDO_PASSWORD" ] && echo "is not null" || echo "is null")"
  echo "test=$test args=$@" 1>&2
  # ls -la /proc/$RSUDO_PID/fd/ 1>&2
  # cat "/proc/$RSUDO_PID/fd/0" 1>&2
  # cat "/proc/$RSUDO_PID/fd/3" 1>&2
  # cat "/proc/$RSUDO_PID/fd/5" 1>&2
  # for k in $(ls /proc/$RSUDO_PID/fd/)
  # do
  #   cat "/proc/$RSUDO_PID/fd/$k" 1>&2
  # done
  # log_trace "RSUDO_PASSWORD=$RSUDO_PASSWORD"
# cat 1>&2
  exit 0
fi

export RSUDO_PID="$$"
# exec 3>/tmp/rsudo_ap_${RSUDO_PID}
# rm -f /tmp/rsudo_ap_${RSUDO_PID}
# echo "test message 3" 1>&3
# echo "test message 5" 1>&5

#------------------------------------------------------------------------------

# replaces rsudo command to allow safe use of env in recursive calls
# needs the following env vars to be defined outside
# required:
# RSUDO_HOST
# RSUDO_USER
# RSUDO_PASSWORD
# optional:
# RSUDO_AS_USER
# RSUDO_INTERACTIVE
rsudo()
{
  log_info "RSUDO STARTED: RSUDO_HOST=$RSUDO_HOST | RSUDO_USER=$RSUDO_USER | RSUDO_PASSWORD $([ -n "$RSUDO_PASSWORD" ] && echo "is not null" || echo "is null")"

  if [ -z "$RSUDO_HOST" ] || [ -z "$RSUDO_USER" ] || [ -z "$RSUDO_PASSWORD" ]
  then
    exit 1
  fi

  # check args
  if [ "$#" -eq "0" ] || [ -z "$*" ]
  then
    log_debug "rsudo no args"
    if [ -t 0 ]
    then
      log_debug "tty present, setting interactive session = true and su command"
      RSUDO_INTERACTIVE="true"
      set -- su
    else
      log_debug "pipe present, set command as /bin/sh -s (execute stream commands)"
      set -- sh -s
    fi
  else
    if [ "$RSUDO_INTERACTIVE" = "true" ] && [ ! -t 0 ]
    then
      RSUDO_PIPE_COMMANDS="$(cat)"
      if [ -n "$RSUDO_PIPE_COMMANDS" ]
      then
        set -- "${RSUDO_PIPE_COMMANDS}" "$@"
        # set -- "${RSUDO_PIPE_COMMANDS}; $@"
        # set -- "${RSUDO_PIPE_COMMANDS}" ";" "$@"
        # set -- "$(saveargs "${RSUDO_PIPE_COMMANDS}" ";" "$@")"
        echo "PIPED ARGS=$@"
        for k in "$@"
        do
          echo "$k"
        done
      fi
    fi

    if [ "$#" -gt "1" ]
    then
      set -- "$(saveargs "$@")"
    fi

    set -- sh -c "$(quote "$@")"
    # set -- sh -c "$(quote "$1")"
  fi

  rsudo_execute "$@"
  EXIT_CODE="$?"

  log_info "RSUDO ENDED: HOST=$RSUDO_HOST - USER=$RSUDO_USER"

  return "$EXIT_CODE"
}

#------------------------------------------------------------------------------

rsudo_execute()
{
  echo "ARGS=$@"
  for k in "$@"
  do
    echo "$k"
  done

  # export DISPLAY=":0.0"
  export SSH_ASKPASS="rsudo-askpass"
  # export SSH_ASKPASS="${0}"
  export SSH_ASKPASS_REQUIRE="force"

  # needed by SSH_ASKPASS command, try to see if it can read pipe
  export RSUDO_PASSWORD

  # check if impersonating another user
  if [ -n "$RSUDO_AS_USER" ]
  then
    SUDO_AS_USER="--user=\"$RSUDO_AS_USER\""
  fi

  if [ "$RSUDO_INTERACTIVE" = "true" ]
  then
    log_debug "interactive command"
    rsudo_interactive "$@"
  else
    log_debug "not interactive command"
    rsudo_not_interactive "$@"
  fi
}

#------------------------------------------------------------------------------

rsudo_interactive()
{
  ssh -t -o 'StrictHostKeyChecking no' -l "$RSUDO_USER" "$RSUDO_HOST" \
  echo "$RSUDO_PASSWORD" \| sudo -S --prompt='' -- true\; sudo $SUDO_AS_USER -- "$@" </dev/tty
}

#------------------------------------------------------------------------------

rsudo_not_interactive()
{
  (echo "$RSUDO_PASSWORD"; [ ! -t 0 ] && cat) | \
  ssh -o 'StrictHostKeyChecking no' -l "$RSUDO_USER" "$RSUDO_HOST" \
  sudo -S --prompt='' $SUDO_AS_USER -- "$@"
}

#------------------------------------------------------------------------------

# if connection args are provided, then host user and password are set accordingly,
# otherwise values are eventually inherited from env vars exported from caller process
# if host is null, exits with error
# if user is null, current user is used
# if password is null: if tty, then it asked to user, else if RSUDO_ASKPASS=true, then it is read from attached pipe (stdin)
rsudo_main_retrieve_connection_args_and_call_rsudo_module_execute()
{
  if [ "$1" = "--" ]
  then
    shift
  elif [ "$1" = "-c" ]
  then
    shift

    if [ "$1" = "${1#*@}" ]
    then
      log_fatal "wrong connection string: $1"
      exit 1
    fi

    RSUDO_HOST="${1#*@}"
    RSUDO_USER="${1%@*}"

    shift
  elif [ "$1" = "-l" ]
  then
    shift

    if [ "$1" = "${1%:*}" ]
    then
      log_fatal "wrong load string: $1"
      exit 1
    fi

    ENV_ENCODED_FILE="${1%:*}"
    ENV_GROUP_NAME="${1#*:}"

    if [ -z "$ENV_ENCODED_FILE" ]
    then
      log_warn "env file not provided, searching into current env."
    elif ! rsudoenv_load "$ENV_ENCODED_FILE"
    then
      log_warn "env file error! not loaded, searching into current env."
    fi

    eval "RSUDO_HOST=\"\$RSUDO_ENV_${ENV_GROUP_NAME}_HOST\""
    eval "RSUDO_USER=\"\$RSUDO_ENV_${ENV_GROUP_NAME}_USER\""
    eval "RSUDO_PASSWORD=\"\$RSUDO_ENV_${ENV_GROUP_NAME}_PASS\""

    shift
  fi

  if [ -z "$RSUDO_HOST" ]
  then
    log_fatal "empty RSUDO_HOST"
    exit 1
  fi

  if [ -z "$RSUDO_USER" ]
  then
    log_info "empty RSUDO_USER, setting it to '$USER'"
    RSUDO_USER="$USER"
  fi

  # unset RSUDO_PASSWORD ### DEBUG prevents reusing exported env
  if [ -z "$RSUDO_PASSWORD" ]
  then
    if [ "$RSUDO_ASKPASS" = "true" ] && [ ! -t 0 ]
    then
      log_debug "read pass from pipe"
      read -r RSUDO_PASSWORD
    else
      log_debug "read pass from tty"
      RSUDO_PASSWORD="$(readpass "[rsudo] Enter password for ${RSUDO_USER}@${RSUDO_HOST}:" < /dev/tty)"
    fi
  fi

  if [ -z "$RSUDO_PASSWORD" ]
  then
    log_fatal "empty RSUDO_PASSWORD"
    exit 1
  fi

  log_debug "RSUDO_HOST=$RSUDO_HOST | RSUDO_USER=$RSUDO_USER | RSUDO_PASSWORD $([ -n "$RSUDO_PASSWORD" ] && echo "is not null" || echo "is null")"
  log_debug "args=$@"

  rsudo_module_execute "$@"
}

#------------------------------------------------------------------------------

# if first arg is the name of a module, the module is loaded and the rest of the command line is executed,
# otherwise the "rsudo" function is executed directly with the given args
rsudo_module_execute()
{
  RSUDO_MODULE="rsudo-mod-${1}.lib.sh"
  if command -v "$RSUDO_MODULE" > /dev/null
  then
    . "$RSUDO_MODULE"
    shift
    "$@"
  else
    rsudo "$@"
  fi
}

#------------------------------------------------------------------------------

rsudo_main_retrieve_connection_args_and_call_rsudo_module_execute "$@"
