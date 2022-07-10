#include "template.h"
#include <iostream>

template_class::template_class(Kernel* k)
{
  std::cout << "\n[template_class::template_class] ";
}

template_class::~template_class()
{
  std::cout << "\n[template_class::~template_class] ";
}

Sequence& template_class::f(number i, Sequence& params, Sequence& res)
{
  std::cout << "\n[template_class::f] ";
  return res;
}
