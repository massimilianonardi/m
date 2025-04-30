#include "LoaderServer.h"

//#include "serviceserver.h"
//#include "serviceclient.h"

LoaderServer::LoaderServer(SERVICE_METHOD_PARAMETERS)
{
  // create srv as name passed with params and pass its own params
  // create a new service server on srv with key passed with params
  // create client with key passed with params
  // notify startup completion via client
  // destroy client
  
  Sequence kkey = params(0);
  Sequence skey = params(1);
  Sequence lkey = params(2);
  Sequence name = (const char*) params;
  Sequence srv_params;
  if(4 == params.size()) srv_params = params(3);
  
  ssp = load(name, srv_params);
//  ss = new ServiceServer(*ssp, skey);
//  sl = new ServiceServer(*this, lkey);
  stream_dlib = new ServiceLoader("ServiceStreamer");
  ss = stream_dlib->create(skey << (Service*) ssp.get());
  sl = stream_dlib->create(lkey << (Service*) this);
  
//  ServiceClient sc(kkey);
  Service* sc = stream_dlib->create(kkey);
  sc->notify(kkey);
  stream_dlib->destroy(sc);
}

LoaderServer::~LoaderServer()
{
  debug_line
  // destroy server
//  delete sl;
//  delete ss;
  stream_dlib->destroy(ss);
  stream_dlib->destroy(sl);
  delete stream_dlib;
  // destroy srv...by srv_seq destructor
}

SERVICE_REGISTER(LoaderServer)
SERVICE_REGISTER_END

//SERVICE_METHOD_DEFINITION(LoaderServer, create)
//{
//}
//
//SERVICE_METHOD_DEFINITION(LoaderServer, destroy)
//{
//  return loader.stop(empty_sequence);
//  return SERVICE_NULL;
//}
//
//SERVICE_METHOD_DEFINITION(LoaderServer, notify)
//{
//}

SERVICE_METHOD_DEFINITION(LoaderServer, stop)
{
  return loader.stop(empty_sequence);
  return SERVICE_NULL;
}
