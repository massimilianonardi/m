#include "template_file_name.h"
#include <iostream>

template_class::template_class(Loader* loader)
{
  std::cout << "\n[template_class::template_class] ";
}

template_class::~template_class()
{
  std::cout << "\n[template_class::~template_class] ";
}

Sequence& template_class::method_1(Sequence& params, Sequence& res)
{
  std::cout << "\n[template_class::method_1] ";
  return 0;
}

Sequence& template_class::method_2(Sequence& params, Sequence& res)
{
  std::cout << "\n[template_class::method_2] ";
  return 0;
}

Sequence& template_class::method_3(Sequence& params, Sequence& res)
{
  std::cout << "\n[template_class::method_3] ";
  return 0;
}
