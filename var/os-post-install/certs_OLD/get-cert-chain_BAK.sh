#!/bin/sh

openssl s_client -connect unix.stackexchange.com:443 -showcerts </dev/null \
| while k="$(openssl x509 -text -subject 2>/dev/null)"
do
  subject="$(echo "$k" | openssl x509 -noout -subject 2>/dev/null)"
  subject="${subject##*CN = }"
  echo "$k" | openssl x509 -text -subject 2>/dev/null | awk '/BEGIN CERTIFICATE/,/END CERTIFICATE/ {print $0}' > "${0}-${subject}.pem"
done

