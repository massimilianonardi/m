#!/bin/sh

source ./project_run_config.sh

cd ../dist/$project_target
./$project_cmdline
read
