#!/bin/sh

cert_dir="${0%/*}/certs"

mkdir -p "$cert_dir"

#openssl s_client -connect unix.stackexchange.com:443 -showcerts </dev/null \
openssl s_client -connect api.snapcraft.io:443 -showcerts </dev/null \
| while k="$(openssl x509 -text -subject 2>/dev/null)"
do
  subject="$(echo "$k" | openssl x509 -noout -subject 2>/dev/null)"
  subject="${subject##*CN = }"
  echo "$k" | openssl x509 -text -subject 2>/dev/null | awk '/BEGIN CERTIFICATE/,/END CERTIFICATE/ {print $0}' > "${cert_dir}/${subject}.pem"
  openssl x509 -in "${cert_dir}/${subject}.pem" -out "${cert_dir}/${subject}.der" -outform DER
done

