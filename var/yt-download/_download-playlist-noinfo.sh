#!/bin/sh

cd -L -- "${0%/*}"

pwd

read -p "playlist/song url: " url

echo "downloading -> $url"

./yt-dlp -x -o "music/playlist/%(playlist_title)s/%(playlist_index)s - %(title)s.%(ext)s" "$url"
