@echo off

cd dist
mkdir %1
cd ..

java -jar regreplace.jar "srv_template/dlib.cpp" "dist/%1/dlib.cpp.tmp" "template_class" "%1" false
java -jar regreplace.jar "srv_template/template.h" "dist/%1/%2.h.tmp" "template_class" "%1" false
java -jar regreplace.jar "srv_template/template.cpp" "dist/%1/%2.cpp.tmp" "template_class" "%1" false

java -jar regreplace.jar "dist/%1/dlib.cpp.tmp" "dist/%1/dlib.cpp.tmp2" "template_file_name" "%2" false
java -jar regreplace.jar "dist/%1/%2.h.tmp" "dist/%1/%2.h.tmp2" "template_file_name" "%2" false
java -jar regreplace.jar "dist/%1/%2.cpp.tmp" "dist/%1/%2.cpp.tmp2" "template_file_name" "%2" false

java -jar regreplace.jar "dist/%1/dlib.cpp.tmp2" "dist/%1/dlib.cpp" "template_define" "%3" false
java -jar regreplace.jar "dist/%1/%2.h.tmp2" "dist/%1/%2.h" "template_define" "%3" false
java -jar regreplace.jar "dist/%1/%2.cpp.tmp2" "dist/%1/%2.cpp" "template_define" "%3" false

cd dist
cd "%1"
del "dlib.cpp.tmp"
del "%2.h.tmp"
del "%2.cpp.tmp"

del "dlib.cpp.tmp2"
del "%2.h.tmp2"
del "%2.cpp.tmp2"
cd ..
cd ..
