#include "boot.h"

Boot::Boot(Service* k)
{
  debug("[Boot::Boot 00]")
  this->k = k;
  debug("[Boot::Boot 99]")
}

Boot::~Boot()
{
  debug("[Boot::~Boot]")
}

Sequence Boot::f(number i, Sequence& params)
{
  debug("[Boot::f 00]")
  debug("[Boot::f 00] i = " << (long) i << " - params = " << (char*) params)
  Sequence res;

  debug_instruction(std::cout << "debug instruction\n";)

  try_managed
  Service* srv = 0;
  res = k->f((number) Kernel::create, params = "simple");
  srv = reinterpret_cast<Service*>((long) res[0]);
  srv->f(1, params = "simple local");
  srv->f(1, params = "simple local", res);

  res = k->f(Kernel::create_separate, params = "simple");
  srv = reinterpret_cast<Service*>((long) res[0]);
  srv->f(2, params = "simple remote");
//  srv->f(2, params = "simple remote", res);
//  o << (long) srv; throw o;
  catch_managed("Boot::f")
  debug("handling exception")
//  rethrow_managed
  exit_try_catch_managed

  debug("[Boot::f 99]")
  return res;
}
