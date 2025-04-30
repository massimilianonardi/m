#include "boot.h"
#include <iostream>

Boot::Boot(Kernel* k)
{
  std::cout << "\n[Boot::Boot 00]\n";
  Sequence params, res;

  Service* srv = 0;
  std::cout << "\n[Boot::Boot 01]\n";
//  Service* sk = k;
//  res = sk->f((number) Kernel::create, params = "simple", res);
  res = k->f((number) Kernel::create, params = "simple");
  std::cout << "\n[Boot::Boot 02]\n";
  srv = reinterpret_cast<Service*>((long) res[0]);
//  std::cout << "\n[Boot::Boot 03]\n" << (long) srv << " " << (long)(number) res[0] << " " << (long) res << " " << (long) params[0];
  srv->f(1, params = "simple local");
  std::cout << "\n[Boot::Boot 04]\n";

//  res = sk->f(Kernel::create_separate, params = "simple", res);
  res = k->f(Kernel::create_separate, params = "simple");
  srv = reinterpret_cast<Service*>((long) res[0]);
  srv->f(2, params = "simple remote");
  std::cout << "\n[Boot::Boot 05]\n";
//  srv->f(2, params = "simple remote", res);

  std::cout << "\n[Boot::Boot 99]\n";
}

Boot::~Boot()
{
}

Sequence Boot::f(number i, Sequence& params)
{
  Sequence res;
  return res;
}
