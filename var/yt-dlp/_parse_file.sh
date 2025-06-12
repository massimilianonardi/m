#!/bin/sh

#------------------------------------------------------------------------------

quote()
{
  if [ -z "$1" ]
  then
    printf "''"
  fi

  # printf %s\\n "$1" | sed "s/'/'\\\\''/g;1s/^/'/;\$s/\$/'/"
  printf "%s" "$1" | sed "s/'/'\\\\''/g;1s/^/'/;\$s/\$/'/"
}

#------------------------------------------------------------------------------

cd -L -- "${0%/*}"

pwd

export PATH="$(pwd):$(pwd)/bin:$PATH"

# read -p "download url: " url
json="/m/data/music/tmp/Pop/01.info.json"
json="/m/src/git/m/var/yt-dlp/music/tmp/Album_-_VITA_FUSA/1.info.json"
json="/m/src/git/m/var/yt-dlp/music/tmp/NA/NA.info.json"

# cat "$json" | jq -r '.title'
# cat "$json" | jq '.artists'
# cat "$json" | jq '.release_year'
# cat "$json" | jq '.artist + " - " + .title'

artist="$(cat "$json" | jq -r '.artist')"
album="$(cat "$json" | jq -r '.album')"
track="$(cat "$json" | jq -r '.track')"
track_number="$(cat "$json" | jq -r '.track_number')"

echo "artist=$artist"
echo "album=$album"
echo "track=$track"
echo "track_number=$track_number"

ext="$(cat "$json" | jq -r '.ext')"
title="$(cat "$json" | jq -r '.title')"
fulltitle="$(cat "$json" | jq -r '.fulltitle')"
alt_title="$(cat "$json" | jq -r '.alt_title')"
creator="$(cat "$json" | jq -r '.creator')"
playlist_title="$(cat "$json" | jq -r '.playlist_title')"
playlist_index="$(cat "$json" | jq -r '.playlist_index')"

echo "ext=$ext"
echo "title=$title"
echo "fulltitle=$fulltitle"
echo "alt_title=$alt_title"
echo "creator=$creator"
echo "playlist_title=$playlist_title"
echo "playlist_index=$playlist_index"



echo ""
echo "--------------------------------------------------------------------------------"
echo "press ENTER to exit"
read -r EXIT_VAR
