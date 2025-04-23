#!/bin/sh

read -p "PRESS ENTER TO EXIT" test
exit 0

sudo apt install -y ca-certificates
sudo cp "${0%/*}/certs/rpr-DOM-CA.pem" /usr/local/share/ca-certificates
sudo cp "${0%/*}/certs/rpr.local.pem" /usr/local/share/ca-certificates
sudo update-ca-certificates

sudo apt install -y git-all
sudo apt install -y screen
sudo apt install -y curl
sudo apt install -y meld
sudo apt install -y openjdk-21-jdk
sudo apt install -y remmina remmina-plugin-vnc
sudo apt install -y libreoffice
sudo dpkg -i "${0%/*}/../omnissa/Omnissa-Horizon-Client-2412-8.14.0-12437214089.x64.deb"
sudo dpkg -i "${0%/*}/../pulsar_1.127.2025033016_amd64.deb"

