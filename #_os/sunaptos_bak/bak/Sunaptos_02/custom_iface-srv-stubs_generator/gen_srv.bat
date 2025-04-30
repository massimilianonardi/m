@echo off

cd dist
mkdir %1
cd ..

java -jar regreplace.jar "srv_template/dlib.cpp" "dist/%1/dlib.cpp" "srv_template" "%1" false
java -jar regreplace.jar "srv_template/srv_template.h" "dist/%1/%1.h" "srv_template" "%1" false
java -jar regreplace.jar "srv_template/srv_template.cpp" "dist/%1/%1.cpp" "srv_template" "%1" false
