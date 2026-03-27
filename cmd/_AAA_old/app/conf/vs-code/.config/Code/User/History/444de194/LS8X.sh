#!/bin/sh

# amd64
wget -O - http://repos.apiseven.com/pubkey.gpg | sudo apt-key add -
echo "deb http://repos.apiseven.com/packages/debian bullseye main" | sudo tee /etc/apt/sources.list.d/apisix.list

# arm64
#wget -O - http://repos.apiseven.com/pubkey.gpg | sudo apt-key add -
#echo "deb http://repos.apiseven.com/packages/arm64/debian bullseye main" | sudo tee /etc/apt/sources.list.d/apisix.list

sudo apt update
sudo apt install -y apisix
