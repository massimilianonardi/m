#!/bin/sh

cd -L -- "${0%/*}"

pwd

read -p "album url: " url

echo "downloading -> $url"

./yt-dlp_macos -x -o "music/artist/%(artist)s/%(album)s/%(artist)s - %(album)s - %(playlist_index)s - %(title)s.%(ext)s" "$url"
