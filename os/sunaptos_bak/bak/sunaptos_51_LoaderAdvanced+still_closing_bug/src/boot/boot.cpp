#include "boot.h"
#include "ServiceLoader.h"

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

  debug("[Boot::f 01 construct local]")
  debug_line
  service_shared_pointer ssp = load("simple", 0);
  debug_line
  Service& srv = *ssp;
  
  debug("[Boot::f 02 test local]")
  debug_line
  srv.create("testing simple create...");
  srv.destroy("testing simple destroy...");
  srv.f("test1", "simple remote");
  srv.f("test2", "simple remote");
  srv.f("create", 0);
//  srv.f("stop", 0);
//  srv.stop(0);
//  srv.f(1, "simple local");
//  std::cout << (char*) srv->f("test1", "simple remote");
//  std::cout << (char*) srv->f("test2", "simple remote");
  debug_line
  loader.stop(&srv);
  
  debug("[Boot::f 03 construct remote]")
  debug_line
//  service_shared_pointer ssp2 = load(".simple", 0); srv = *ssp2;
  loader.set("LoaderAdvanced");
  debug_line
  service_shared_pointer ssp2 = load("simple", 0); srv = *ssp2;
  
  debug("[Boot::f 04 test remote]")
  debug_line
  srv.create("testing simple create...");
  srv.destroy("testing simple destroy...");
  srv.f("test1", "simple remote");
  srv.f("test2", "simple remote");
//  loader.stop(&srv);
//  loader.set("LoaderLocal");
  
//  debug("[Boot::f 05 test destroing local]")
//  debug_line
////  ssp = load(".simple", 0); srv = *ssp; // destroys old srv
//  Service* psrv = ssp.get();
//  debug_line
//  ssp.reset();
//  debug_line
//  psrv->create("testing simple create...with destroyed pointer(SHOULD NOT SEE THIS MESSAGE)!");
////  ssp->create("testing simple create...with destroyed pointer(SHOULD NOT SEE THIS MESSAGE)!");
//  debug_line
  
//  loader.stop(empty_sequence);
  exception_catch_print
  exception_end
  debug("[Boot::f 99]")
  return res;
}

SERVICE_METHOD_DEFINITION(Boot, stop)
{
}
