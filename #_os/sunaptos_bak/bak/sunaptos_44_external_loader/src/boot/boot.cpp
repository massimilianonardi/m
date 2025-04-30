#include "boot.h"

//Boot::Boot(Service* k)
//{
//  debug("[Boot::Boot 00]")
//  this->k = k;
//  start(0);
//  debug("[Boot::Boot 99]")
//}

Boot::Boot(SERVICE_METHOD_PARAMETERS)
{
  debug("[Boot::Boot 00]")
  start(0);
  debug("[Boot::Boot 99]")
}

Boot::~Boot()
{
  debug("[Boot::~Boot]")
}

SERVICE_REGISTER(Boot)
SERVICE_REGISTER_END

SERVICE_METHOD_DEFINITION(Boot, start)
{
  debug("[Boot::f 00]")
  Sequence res;

  exception_try
  debug_instruction(std::cout << "debug instruction\n";)

//  Service* srv = 0;
  debug("[Boot::f 01]")
//  Service& srv = k->f(Kernel::create_local, "simple");
//  Service& srv = k->create("simple");
//  Service& srv = ldr::i().create("simple");
//  ServiceLoader srv("simple", params);
  Service& srv = ldr::i().create("simple", 0);
//  delete &srv;
  debug("[Boot::f 02]")
  srv.create("testing simple create...");
  srv.destroy("testing simple destroy...");
  srv.f("test1", "simple remote");
  srv.f("create", 0);
//  srv.f("stop", 0);
//  srv.stop(0);
//  srv.f(1, "simple local");
//  std::cout << (char*) srv->f("test1", "simple remote");
//  std::cout << (char*) srv->f("test2", "simple remote");

  debug("[Boot::f 03]")
  Sequence params2 = "simple";
//  srv = k->f(Kernel::create_separate, params2);
//  srv = k->create(".simple");
//  srv = ldr::i().create(".simple");
//  Sequence seq = ldr::i().create(".simple");
//  void* v = (void*)(char*) seq;
//  Service* psrv = (Service*) v;
//  *psrv;
//  srv = &(*psrv);
//  ServiceLoader sl("simple", params);
//  srv = *sl;
//  delete sl.get();
//  sl.~ServiceLoader();
//  srv = ServiceLoader("simple", params);
  debug("[Boot::f 04]")
  srv.create("testing simple create...");
  srv.destroy("testing simple destroy...");
//  srv.stop();
//  srv.f(2, "simple remote");
//  srv.f("stop", "stop exception test");
  srv.f("test1", "simple remote");
  srv.f("test2", "simple remote");
//  srv.f(10, "simple remote test unknown method");
//  srv.f(11, "simple remote test unknown method");
//  std::cout << (char*) srv.f("test1", "simple remote");
//  std::cout << (char*) srv.f("test2", "simple remote");
//  std::cout << (char*) srv.f(10, "simple remote test unknown method");
//  std::cout << (char*) srv.f(11, "simple remote test unknown method");
//  ServiceLoader krn("KernelMaster", params);
  Service& krn = ldr::i().create("KernelMaster", params);
  srv = krn.create("simple");
  srv.create("testing simple create...");
  srv.destroy("testing simple destroy...");
  
  debug("[Boot::f 05]")
//  srv = k->f(Kernel::create_separate, "gui");
  
//  k->f(Kernel::exit_process, "");
  ldr::i().exit(0);
//  o << (long) srv; throw o;

  exception_catch_print
  exception_end
  debug("[Boot::f 99]")
  return res;
}

SERVICE_METHOD_DEFINITION(Boot, stop)
{
}
