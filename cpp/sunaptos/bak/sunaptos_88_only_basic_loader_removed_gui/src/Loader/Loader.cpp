#include "Loader.h"

Loader::Loader(SERVICE_METHOD_PARAMETERS)
{
  lck.lock();
}

Loader::~Loader()
{
}

SERVICE_REGISTER(Loader)
SERVICE_REGISTER_END

SERVICE_METHOD_DEFINITION(Loader, create)
{
  const char *name = params;
  Sequence srv_params;
  if(0 < params.size()) srv_params = params(0);
  ServiceLoader* sldr = new ServiceLoader(name);
  Service* srv = sldr->create(srv_params);
  dlib_map[srv] = sldr;
  return srv;
}

SERVICE_METHOD_DEFINITION(Loader, destroy)
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

SERVICE_METHOD_DEFINITION(Loader, stop)
{
  lck.unlock();
  return SERVICE_NULL;
}

SERVICE_METHOD_DEFINITION(Loader, wait_unlock)
{
  lck.waitunlock();
  return SERVICE_NULL;
}
