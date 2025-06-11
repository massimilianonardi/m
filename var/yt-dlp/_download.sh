#!/bin/sh

cd -L -- "${0%/*}"

pwd

PATH="$(pwd):$(pwd)/bin:$PATH"

read -p "download url: " url

echo "downloading -> $url"
mkdir -p "$(pwd)/music/playlist"

yt-dlp \
--extract-audio \
--audio-format m4a \
--audio-quality 0 \
--restrict-filenames \
--abort-on-unavailable-fragments \
--embed-thumbnail \
--convert-thumbnails jpg \
--no-check-certificate \
--add-metadata \
--write-info-json \
--abort-on-error \
--ffmpeg-location "$(pwd)/bin" \
--output "$(pwd)/music/tmp/%(playlist_title)s/%(playlist_index)s.%(ext)s" "$url"
#--simulate \

echo ""
echo "--------------------------------------------------------------------------------"
echo "press ENTER to exit"
read -r EXIT_VAR
