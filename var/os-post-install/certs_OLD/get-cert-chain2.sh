#!/bin/bash
# get-cert-chain.sh

machine=${1?No address passed}

machine_cert=${machine}.pem

# from https://stackoverflow.com/a/68637388/5401366
getcaissuer() {
    openssl x509 -noout -text -in $1 -ext authorityInfoAccess | awk '/^[ \t]+CA Issuers[ \t]+-[ \t]+URI:/ { print gensub(/^.*URI:(.*)$/,"\\1","g",$0); }'
}

if [ ! -e "${machine_cert}" ];
then
    openssl s_client -connect ${machine}:443 -showcerts </dev/null 2>/dev/null | openssl x509 -outform PEM >${machine_cert}
fi;

cur_cert=$machine_cert

while :;
do
    # Get the first matching http line to grab the next cert loc
    nextca=$(getcaissuer ${cur_cert} | grep -m1 http)

    # ran out of stuff to retrieve
    [ -z "${nextca}" ] && break

    echo "Trying to get '${nextca}'"

    nextfile=$(basename ${nextca})

    if [ ! -e ${nextfile} ];
    then
        echo "Getting $nextca"
        curl -sO $nextca
    else
        echo "Found ${nextfile}"
    fi

    # Convert
    openssl x509 -in $nextfile -outform PEM > ${nextfile}.pem

    # down the rabbit hole...
    cur_cert=${nextfile}.pem

done

