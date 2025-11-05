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
# sudo apisix start --config "/usr/local/apisix/conf/config.yaml"
#sudo apisix stop
#sudo apisix help
#systemctl start apisix
#systemctl stop apisix

systemctl list-unit-files --state=enabled
systemctl list-unit-files --state=running

# validate
curl "http://127.0.0.1:9080" --head | grep Server



. /etc/environment.d/99-m-paths.conf
export PATH="/m/bin:$PATH"
