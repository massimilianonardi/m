#!/bin/sh

# amd64
wget -O - http://repos.apiseven.com/pubkey.gpg | sudo apt-key add -
echo "deb http://repos.apiseven.com/packages/debian bullseye main" | sudo tee /etc/apt/sources.list.d/apisix.list

# arm64
#wget -O - http://repos.apiseven.com/pubkey.gpg | sudo apt-key add -
#echo "deb http://repos.apiseven.com/packages/arm64/debian bullseye main" | sudo tee /etc/apt/sources.list.d/apisix.list

sudo apt update
sudo apt install -y apisix

sudo apisix init

sudo nano /usr/local/apisix/conf/config.yaml

sudo apisix start
#sudo apisix stop
#sudo apisix help
#systemctl start apisix
#systemctl stop apisix

APISIX_KEY="admin_key"
curl "http://127.0.0.1:9180/apisix/admin/routes?api_key=$APISIX_KEY" -i
