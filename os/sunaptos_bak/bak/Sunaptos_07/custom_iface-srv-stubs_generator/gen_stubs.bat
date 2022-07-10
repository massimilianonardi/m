@echo off

cd dist
mkdir %1
cd ..

java -jar regreplace.jar "stub_template_cli/dlib.cpp" "dist/%1/dlib.cpp.tmp" "template_class" "%1" false
java -jar regreplace.jar "stub_template_cli/template.h" "dist/%1/%2.h.tmp" "template_class" "%1" false
java -jar regreplace.jar "stub_template_cli/template.cpp" "dist/%1/%2.cpp.tmp" "template_class" "%1" false

java -jar regreplace.jar "dist/%1/dlib.cpp.tmp" "dist/%1/dlib.cpp.tmp2" "template_file_name" "%2" false
java -jar regreplace.jar "dist/%1/%2.h.tmp" "dist/%1/%2.h.tmp2" "template_file_name" "%2" false
java -jar regreplace.jar "dist/%1/%2.cpp.tmp" "dist/%1/%2.cpp.tmp2" "template_file_name" "%2" false

java -jar regreplace.jar "dist/%1/dlib.cpp.tmp2" "dist/%1/dlib.cpp" "template_define" "%3" false
java -jar regreplace.jar "dist/%1/%2.h.tmp2" "dist/%1/%2_cli.h" "template_define" "%3" false
java -jar regreplace.jar "dist/%1/%2.cpp.tmp2" "dist/%1/%2_cli.cpp" "template_define" "%3" false

cd dist
cd "%1"
del "dlib.cpp.tmp"
del "%2.h.tmp"
del "%2.cpp.tmp"

del "dlib.cpp.tmp2"
del "%2.h.tmp2"
del "%2.cpp.tmp2"
cd ..
ren "%1" "%1_cli"
cd ..

cd dist
mkdir %1
cd ..

java -jar regreplace.jar "stub_template_srv/dlib.cpp" "dist/%1/dlib.cpp.tmp" "template_class" "%1" false
java -jar regreplace.jar "stub_template_srv/template.h" "dist/%1/%2.h.tmp" "template_class" "%1" false
java -jar regreplace.jar "stub_template_srv/template.cpp" "dist/%1/%2.cpp.tmp" "template_class" "%1" false

java -jar regreplace.jar "dist/%1/dlib.cpp.tmp" "dist/%1/dlib.cpp.tmp2" "template_file_name" "%2" false
java -jar regreplace.jar "dist/%1/%2.h.tmp" "dist/%1/%2.h.tmp2" "template_file_name" "%2" false
java -jar regreplace.jar "dist/%1/%2.cpp.tmp" "dist/%1/%2.cpp.tmp2" "template_file_name" "%2" false

java -jar regreplace.jar "dist/%1/dlib.cpp.tmp2" "dist/%1/dlib.cpp" "template_define" "%3" false
java -jar regreplace.jar "dist/%1/%2.h.tmp2" "dist/%1/%2_srv.h" "template_define" "%3" false
java -jar regreplace.jar "dist/%1/%2.cpp.tmp2" "dist/%1/%2_srv.cpp" "template_define" "%3" false

cd dist
cd "%1"
del "dlib.cpp.tmp"
del "%2.h.tmp"
del "%2.cpp.tmp"

del "dlib.cpp.tmp2"
del "%2.h.tmp2"
del "%2.cpp.tmp2"
cd ..
ren "%1" "%1_srv"
cd ..
