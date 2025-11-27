#!/bin/sh

# read -p "PRESS ENTER TO EXIT" test
# exit 0

sudo apt install -y ca-certificates
sudo cp "${0%/*}/certs/rpr-DOM-CA.pem" /usr/local/share/ca-certificates
sudo cp "${0%/*}/certs/rpr.local.pem" /usr/local/share/ca-certificates
sudo update-ca-certificates

sudo apt install -y git-all
sudo apt install -y screen
sudo apt install -y curl
sudo apt install -y podman
sudo apt install -y nmap
sudo apt install -y meld
sudo apt install -y openjdk-21-jdk
sudo apt install -y remmina remmina-plugin-vnc
sudo apt install -y libreoffice
sudo dpkg -i "${0%/*}/../omnissa/Omnissa-Horizon-Client-2412-8.14.0-12437214089.x64.deb"

sudo apt install -y nodejs npm
sudo apt install -y yui-compressor

sudo apt install -y build-essential
sudo apt install -y g++
sudo apt install -y gdb
sudo apt install -y cmake
sudo apt install -y cmake-qt-gui
sudo apt install -y ninja-build

# sudo apt install -y ccls
# sudo apt install -y codeblocks
# sudo apt install -y kdevelop
# sudo apt install -y qt6-base-dev
# sudo apt install -y qtcreator
# sudo apt install -y libxcb-cursor0
# sudo apt install -y build-essential libgl1-mesa-dev
# sudo apt install -y ubuntu-sdk
