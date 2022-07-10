#include "LoaderServer.h"

LoaderServer::LoaderServer(SERVICE_METHOD_PARAMETERS)
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
  
////  srv_seq = load(name, srv_params);
//  ServiceLoader srvl(name, srv_params);
//  srv_seq = Sequence(*srvl);
////  srv = srv_seq;
////  ss = new ServiceServer(srv, skey);
//  ss = new ServiceServer(srv_seq, skey);
//  ServiceClient sc(kkey);
//  sc.notify(kkey);
  
  ssp = load(name, srv_params);
  ss = new ServiceServer(*ssp, skey);
  ServiceClient sc(kkey);
  sc.notify(kkey);
}

LoaderServer::~LoaderServer()
{
  // destroy server
  delete ss;
  // destroy srv...by srv_seq destructor
}

SERVICE_REGISTER(LoaderServer)
SERVICE_REGISTER_END

SERVICE_METHOD_DEFINITION(LoaderServer, create)
{
}

SERVICE_METHOD_DEFINITION(LoaderServer, destroy)
{
}

SERVICE_METHOD_DEFINITION(LoaderServer, notify)
{
}
