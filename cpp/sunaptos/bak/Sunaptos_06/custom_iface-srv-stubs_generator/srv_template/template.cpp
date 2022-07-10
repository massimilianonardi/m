#include "template_file_name.h"
#include <iostream>

template_class::template_class(Loader* loader)
{
  std::cout << " [template_class::template_class] ";
}

template_class::~template_class()
{
  std::cout << " [template_class::~template_class] ";
}

Data* template_class::method_1(Data* data)
{
  std::cout << " [template_class::method_1] ";
  return 0;
}

Data* template_class::method_2(Data* data)
{
  std::cout << " [template_class::method_2] ";
  return 0;
}

Data* template_class::method_3(Data* data)
{
  std::cout << " [template_class::method_3] ";
  return 0;
}
