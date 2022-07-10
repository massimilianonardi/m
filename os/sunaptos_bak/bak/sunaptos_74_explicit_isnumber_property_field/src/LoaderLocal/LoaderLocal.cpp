#include <map>

#include "LoaderLocal.h"

LoaderLocal::LoaderLocal(SERVICE_METHOD_PARAMETERS)
{
  lck.lock();
}

LoaderLocal::~LoaderLocal()
{
  debug_line
}

SERVICE_REGISTER(LoaderLocal)
SERVICE_REGISTER_END

SERVICE_METHOD_DEFINITION(LoaderLocal, create)
{
  const char *name = params;
  Sequence srv_params;
  if(0 < params.size()) srv_params = params(0);
  ServiceLoader* sldr = new ServiceLoader(name);
  Service* srv = sldr->create(srv_params);
  dlib_map[srv] = sldr;
//  return *srv;
  return srv;
}

SERVICE_METHOD_DEFINITION(LoaderLocal, destroy)
{
  exception_try
  Service* srv = (Service*) params;
  ServiceLoader* sldr = dlib_map[srv];
  if(sldr == 0) exception_throw_type(ExceptionType::null_pointer)
  sldr->destroy(srv);
  delete sldr;
  dlib_map.erase(srv);
  if(dlib_map.empty()) lck.unlock();
//  delete (Service*) params;
  debug_line
  return SERVICE_NULL;
  exception_catch
  exception_print_stack_trace
  return SERVICE_ERROR;
  exception_end
}

SERVICE_METHOD_DEFINITION(LoaderLocal, stop)
{
  return loader.stop(empty_sequence);
}

//SERVICE_METHOD_DEFINITION(LoaderLocal, lock)
//{
//  lck.lock();
//  return SERVICE_NULL;
//}
//
//SERVICE_METHOD_DEFINITION(LoaderLocal, unlock)
//{
//  lck.unlock();
//  return SERVICE_NULL;
//}
//
//SERVICE_METHOD_DEFINITION(LoaderLocal, try_lock)
//{
//  lck.trylock();
//  return SERVICE_NULL;
//}

SERVICE_METHOD_DEFINITION(LoaderLocal, wait_unlock)
{
  lck.waitunlock();
  return SERVICE_NULL;
}
