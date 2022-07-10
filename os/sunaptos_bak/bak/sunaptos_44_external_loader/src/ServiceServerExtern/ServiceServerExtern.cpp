#include "ServiceServerExtern.h"

ServiceServerExtern::ServiceServerExtern(SERVICE_METHOD_PARAMETERS)
{
  // create srv as name passed with params and pass its own params
  // create a new service server on srv with key passed with params
  // create client with key passed with params
  // notify startup completion via client
  // destroy client
//  Sequence p = params;
//  Sequence kkey = p(0);
  Sequence kkey = params(0);
  Sequence skey = params(1);
  Sequence name = params(2);
  Sequence srv_params = params;
  srv_params.del(2);
  srv_params.del(1);
  srv_params.del(0);
  
  Service& srv = ldr::i().create(name, srv_params);
  new ServiceServer(srv, skey);
  ServiceClient sc(kkey);
  sc.notify(kkey);
}

ServiceServerExtern::~ServiceServerExtern()
{
  // destroy server
  // destroy srv
}

SERVICE_REGISTER(ServiceServerExtern)
SERVICE_REGISTER_END

SERVICE_METHOD_DEFINITION(ServiceServerExtern, create)
{
}

SERVICE_METHOD_DEFINITION(ServiceServerExtern, destroy)
{
}

SERVICE_METHOD_DEFINITION(ServiceServerExtern, notify)
{
}
