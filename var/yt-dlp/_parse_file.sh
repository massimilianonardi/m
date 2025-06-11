#!/bin/sh

cd -L -- "${0%/*}"

pwd

PATH="$(pwd):$(pwd)/bin:$PATH"

# read -p "download url: " url
file="/m/data/music/tmp/Pop/00.info.json"

cat "$file" | jq '.title'

echo ""
echo "--------------------------------------------------------------------------------"
echo "press ENTER to exit"
read -r EXIT_VAR
