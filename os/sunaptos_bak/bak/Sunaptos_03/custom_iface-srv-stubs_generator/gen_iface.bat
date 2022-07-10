@echo off

cd dist
mkdir %1
mkdir %1_cli
mkdir %1_srv
cd ..

java -jar regreplace.jar "iface_template/dlib.cpp" "dist/%1/dlib.cpp" "iface_template" "%1" false
java -jar regreplace.jar "iface_template/iface_template.h" "dist/%1/%1.h" "iface_template" "%1" false

java -jar regreplace.jar "iface_template_cli/dlib.cpp" "dist/%1_cli/dlib.cpp" "iface_template" "%1" false
java -jar regreplace.jar "iface_template_cli/iface_template_cli.h" "dist/%1_cli/%1_cli.h" "iface_template" "%1" false
java -jar regreplace.jar "iface_template_cli/iface_template_cli.cpp" "dist/%1_cli/%1_cli.cpp" "iface_template" "%1" false

java -jar regreplace.jar "iface_template_srv/dlib.cpp" "dist/%1_srv/dlib.cpp" "iface_template" "%1" false
java -jar regreplace.jar "iface_template_srv/iface_template_srv.h" "dist/%1_srv/%1_srv.h" "iface_template" "%1" false
java -jar regreplace.jar "iface_template_srv/iface_template_srv.cpp" "dist/%1_srv/%1_srv.cpp" "iface_template" "%1" false
