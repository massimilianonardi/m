#include "boot.h"
#include <iostream>

Boot::Boot(Kernel* k)
{
  std::cout << "\n[Boot::Boot 00]\n";
  Sequence params, res;
  k->f(Kernel::create, params = "template", res);
  std::cout << "\n[Boot::Boot 99]\n";
}

Boot::~Boot()
{
}

Sequence& Boot::f(number i, Sequence& params, Sequence& res)
{
  return res;
}
