#include "simple.h"
#include <iostream>

Simple::Simple(Kernel* k)
{
  std::cout << "\n[Simple::Simple]\n";
}

Simple::~Simple()
{
  std::cout << "\n[Simple::~Simple]\n";
}

Sequence Simple::f(number i, Sequence& params)
{
  std::cout << "\n[Simple::f 00]\n";
  std::cout << "\n[Simple::f] i = " << (long) i << " params = " << (char*) params << "\n";
  Sequence res;
  return res;
}
