#include "Loader.h"

Loader::Loader(SERVICE_METHOD_PARAMETERS): ldr_dlib(0), ldr(0)
{
  ldr_dlib = new ServiceLoader("LoaderLocal");
  ldr = ldr_dlib->create(params);
}

Loader::~Loader()
{
  ldr_dlib->destroy(ldr);
  delete ldr_dlib;
}

SERVICE_REGISTER(Loader)
SERVICE_REGISTER_END

SERVICE_METHOD_DEFINITION(Loader, create)
{
  return ldr->create(params);
}

SERVICE_METHOD_DEFINITION(Loader, destroy)
{
  return ldr->destroy(params);
}

SERVICE_METHOD_DEFINITION(Loader, set)
{
  ServiceLoader* ldr_dlib_old = ldr_dlib;
  Service* ldr_old = ldr;
  
  ldr_dlib = new ServiceLoader(params);
  // todo: ldr must be synchronized
  Sequence srv_params;
  if(0 < params.size()) srv_params = params(0);
  ldr = ldr_dlib->create(srv_params);
  
  // TODO: only loaders that have no longer services active can be deleted, otherwise segfault will occur
  //       create a thread to queue loader destruction (one global LoaderDestroyer, or one for each loader?))
//  ldr_dlib_old->destroy(ldr_old);
//  delete ldr_dlib_old;
  
  return SERVICE_NULL;
}
