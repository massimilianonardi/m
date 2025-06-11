#!/bin/sh

cd -L -- "${0%/*}"

pwd

read -p "playlist/song url: " url

echo "downloading -> $url"

./yt-dlp_macos -x -o "music/playlist/%(playlist_title)s/%(artist)s - %(album)s - %(title)s.%(ext)s" "$url"
