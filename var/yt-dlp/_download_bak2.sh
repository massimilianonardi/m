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
--abort-on-error \
--ffmpeg-location "$(pwd)/bin" \
--exec post_process:"echo \"$(pwd)/music/artist/%(artist)s/%(album)s/%(artist)s - %(album)s - %(track_number)s - %(title)s.%(ext)s\"" \
--output "$(pwd)/music/artist/%(artist)s/%(album)s/%(artist)s - %(album)s - %(track_number)s - %(title)s.%(ext)s" "$url"
#--write-info-json \
#--simulate \

echo ""
echo "--------------------------------------------------------------------------------"
echo "press ENTER to exit"
read -r EXIT_VAR
