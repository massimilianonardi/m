#include "boot.h"
#include <iostream>

Boot::Boot(Kernel* k)
{
//  std::cout << "\n[Boot::Boot 00]\n";
  this->k = k;
//  std::cout << "\n[Boot::Boot 99]\n";
}

Boot::~Boot()
{
}

Sequence Boot::f(number i, Sequence& params)
{
  std::cout << "\n[Boot::f 00]\n";
  Sequence res;

  Service* srv = 0;
  res = k->f((number) Kernel::create, params = "simple");
  srv = reinterpret_cast<Service*>((long) res[0]);
  srv->f(1, params = "simple local");
  srv->f(1, params = "simple local", res);

  res = k->f(Kernel::create_separate, params = "simple");
  srv = reinterpret_cast<Service*>((long) res[0]);
  srv->f(2, params = "simple remote");
//  srv->f(2, params = "simple remote", res);

  return res;
}
