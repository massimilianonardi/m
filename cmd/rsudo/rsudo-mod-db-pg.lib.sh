#!/bin/sh

#------------------------------------------------------------------------------

rsudo_mod_db_pg_psql()
{
  rsudo --user "postgres" psql "$@"
}

#------------------------------------------------------------------------------

rsudo_mod_db_pg_getdb()
{
  rsudo --user "postgres" pg_dump "$@"
}

#------------------------------------------------------------------------------

rsudo_mod_db_pg_putdb()
{
(
  if [ -z "$1" ]
  then
    exit 1
  fi

  REMOTE_DB="$1"
  LOCAL_PATH="$2"

  if [ -z "$LOCAL_PATH" ] && [ -t 0 ]
  then
    exit 1
  fi

  # sql "" "SELECT pg_terminate_backend(pg_stat_activity.procid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$REMOTE_DB' AND procid <> pg_backend_pid();" 1>/dev/null 2>/dev/null
  # sql "" "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$REMOTE_DB' AND pid <> pg_backend_pid();" 1>/dev/null 2>/dev/null
  rsudo systemctl restart postgresql
  RSUDO_AS_USER="postgres"
  rsudo dropdb "$REMOTE_DB"
  # execute_as postgres dropdb "$REMOTE_DB" 1>/dev/null 2>/dev/null
  # execute_as postgres dropdb --if-exists "$REMOTE_DB" 1>/dev/null 2>/dev/null


  if [ -z "$LOCAL_PATH" ]
  then
    sh -c "createdb '$REMOTE_DB' && psql '$REMOTE_DB'"
  else
    cat "$LOCAL_PATH" | sh -c "createdb '$REMOTE_DB' && psql '$REMOTE_DB'"
  fi
)
}

#------------------------------------------------------------------------------

___rsudo_mod_db_pg_resetdb()
{
  if [ -z "$1" ]
  then
    exit 1
  fi

  # rsudo systemctl restart postgresql
  # rsudo --user "postgres" dropdb "$1"
  # rsudo --user "postgres" createdb "$1"
  rsudo "systemctl restart postgresql; sudo --user='postgres' dropdb '$1'; sudo --user='postgres' createdb '$1'"
}

rsudo_mod_db_pg_resetdb()
{
  if [ -z "$1" ]
  then
    exit 1
  fi

  set -- "$1" "tmp_db_$(date +"[%Y_%m_%d_%H_%M_%S]")"

  rsudo --user "postgres" createdb "$2"

  rsudo --user "postgres" psql "$2" \
  -c "ALTER DATABASE $1 WITH ALLOW_CONNECTIONS false;" \
  -c "ALTER DATABASE $1 WITH CONNECTION LIMIT 0;" \
  -c "SELECT pg_terminate_backend (pid) FROM pg_stat_activity WHERE datname = '$1' AND pid <> pg_backend_pid();" \
  -c "DROP DATABASE $1;" \
  -c "CREATE DATABASE $1;"

  # rsudo --user "postgres" psql "$1" \
  # -c "ALTER DATABASE $1 WITH ALLOW_CONNECTIONS false;" \
  # -c "ALTER DATABASE $1 WITH CONNECTION LIMIT 0;" \
  # -c "SELECT pg_terminate_backend (pid) FROM pg_stat_activity WHERE datname = '$1' AND pid <> pg_backend_pid();" \
  # -d "postgres" -c "DROP DATABASE $1; CREATE DATABASE $1;"

  # rsudo --user "postgres" psql "$1" -c "ALTER DATABASE $1 WITH CONNECTION LIMIT 0; ALTER DATABASE $1 WITH ALLOW_CONNECTIONS false; \
  # SELECT pg_terminate_backend (pid) FROM pg_stat_activity WHERE datname = '$1' AND pid <> pg_backend_pid(); \
  # DROP DATABASE $1; CREATE DATABASE $1;"
}

rsudo_mod_db_pg_resetdb()
{
  if [ -z "$1" ]
  then
    exit 1
  fi

  rsudo --user "postgres" psql "$1" \
  -c "ALTER DATABASE $1 WITH CONNECTION LIMIT 0;" \
  -c "SELECT pg_terminate_backend (pid) FROM pg_stat_activity WHERE datname = '$1' AND pid <> pg_backend_pid();"

  rsudo --user "postgres" "dropdb '$1' && createdb '$1'"

  # rsudo --user "postgres" psql "$1" \
  # -c "ALTER DATABASE $1 WITH ALLOW_CONNECTIONS false;" \
  # -c "ALTER DATABASE $1 WITH CONNECTION LIMIT 0;" \
  # -c "SELECT pg_terminate_backend (pid) FROM pg_stat_activity WHERE datname = '$1' AND pid <> pg_backend_pid();"

  # rsudo --user "postgres" psql "$1" -c "ALTER DATABASE $1 WITH CONNECTION LIMIT 0; ALTER DATABASE $1 WITH ALLOW_CONNECTIONS false; \
  # SELECT pg_terminate_backend (pid) FROM pg_stat_activity WHERE datname = '$1' AND pid <> pg_backend_pid(); \
  # DROP DATABASE $1; CREATE DATABASE $1;"
}

#------------------------------------------------------------------------------

rsudo_mod_db_pg_postgis_create_string()
{
  echo "CREATE EXTENSION postgis; CREATE EXTENSION postgis_topology;"
}

#------------------------------------------------------------------------------
