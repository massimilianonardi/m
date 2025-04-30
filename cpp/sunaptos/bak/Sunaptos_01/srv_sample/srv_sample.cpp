#include "srv_sample.h"
#include "srv_template.h"
#include <iostream>

srv_sample::srv_sample(Loader* loader)
{
  std::cout << "test";
  srv_template* srv1 = dynamic_cast<srv_template*>(loader->getInterface("iface_name_srv.dlib", "srv_template.dlib"));
  srv1->method_1(0);
  srv1->method_2(0);
  srv1->method_3(0);
  std::cout << "aa";
  srv_template* srv2 = dynamic_cast<srv_template*>(loader->getInterfaceRemote("iface_name_srv.dlib", "srv_template.dlib"));
  srv2->method_1(0);
  srv2->method_2(0);
  srv2->method_3(0);
  std::cout << "ab";
}

srv_sample::~srv_sample()
{
}

Data* srv_sample::method_1(Data* data)
{
  std::cout << " [srv_sample::method_1] ";
  return 0;
}

Data* srv_sample::method_2(Data* data)
{
  std::cout << " [srv_sample::method_2] ";
  return 0;
}

Data* srv_sample::method_3(Data* data)
{
  std::cout << " [srv_sample::method_3] ";
  return 0;
}
