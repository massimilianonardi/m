#include "srv_template.h"
#include <iostream>

srv_template::srv_template(Loader* loader)
{
  std::cout << " [srv_template::srv_template] ";
}

srv_template::~srv_template()
{
  std::cout << " [srv_template::~srv_template] ";
}

Data* srv_template::method_1(Data* data)
{
  std::cout << " [srv_template::method_1] ";
  return 0;
}

Data* srv_template::method_2(Data* data)
{
  std::cout << " [srv_template::method_2] ";
  return 0;
}

Data* srv_template::method_3(Data* data)
{
  std::cout << " [srv_template::method_3] ";
  return 0;
}
