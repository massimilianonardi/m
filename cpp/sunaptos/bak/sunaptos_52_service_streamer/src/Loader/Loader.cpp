#include "Loader.h"

Loader::Loader(SERVICE_METHOD_PARAMETERS): ldr_dlib(0), ldr(0)
{
  ldr_dlib = new ServiceLoader("LoaderLocal");
  ldr = ldr_dlib->create(params);
  lck.lock();
}

Loader::~Loader()
{
  ldr->wait_unlock(empty_sequence);
  ldr_dlib->destroy(ldr);
  delete ldr_dlib;
}

SERVICE_REGISTER(Loader)
SERVICE_REGISTER_END

SERVICE_METHOD_DEFINITION(Loader, create)
{
  Service* srv =  ldr->create(params);
  debug((long) srv)
  debug((long) ldr)
  ldr_map[srv] = ldr;
  return srv;
}

SERVICE_METHOD_DEFINITION(Loader, destroy)
{
  debug((long)(Service*) params)
  debug((long)(Service*) ldr_map[params])
  Sequence res = ldr_map[params]->destroy(params);
  debug_line
  ldr_map.erase(params);
  return res;
}

SERVICE_METHOD_DEFINITION(Loader, set)
{
  ServiceLoader* ldr_dlib_old = ldr_dlib;
  Service* ldr_old = ldr;
  
  ldr_dlib = new ServiceLoader(params);
  Sequence srv_params;
  if(0 < params.size()) srv_params = params(0);
  ldr = ldr_dlib->create(srv_params);
  
  threads_loaders_destroyers.push_back(std::thread(
  [ldr_dlib_old, ldr_old]()
  {
    ldr_old->wait_unlock(empty_sequence);
    ldr_dlib_old->destroy(ldr_old);
    delete ldr_dlib_old;
  }));
  
  return SERVICE_NULL;
}

SERVICE_METHOD_DEFINITION(Loader, stop)
{
  if(params != empty_sequence) return ldr->stop(params);
  lck.unlock();
  return SERVICE_NULL;
}

//SERVICE_METHOD_DEFINITION(Loader, lock)
//{
//  lck.lock();
//  return SERVICE_NULL;
//}
//
//SERVICE_METHOD_DEFINITION(Loader, unlock)
//{
//  lck.unlock();
//  return SERVICE_NULL;
//}
//
//SERVICE_METHOD_DEFINITION(Loader, try_lock)
//{
//  lck.trylock();
//  return SERVICE_NULL;
//}

SERVICE_METHOD_DEFINITION(Loader, wait_unlock)
{
  lck.waitunlock();
  return SERVICE_NULL;
}
