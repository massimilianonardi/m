#include "Loader.h"

#include "functions.h"

Loader::Loader(SERVICE_METHOD_PARAMETERS)
{
  ldr_id = generateKey();
  lck.lock();
}

Loader::~Loader()
{
}

SERVICE_REGISTER(Loader)
SERVICE_REGISTER_END

SERVICE_METHOD_DEFINITION(Loader, id)
{
  return ldr_id;
}

SERVICE_METHOD_DEFINITION(Loader, search)
{
  return 0 != dlib_map[(service*) params];
}

SERVICE_METHOD_DEFINITION(Loader, validate)
{
  return dlib_map[(service*) params];
}

SERVICE_METHOD_DEFINITION(Loader, create)
{
  const char *name = params(0);
  sequence srv_params;
  if(1 < params.size()) srv_params = params(1);
  ServiceLoader* sldr = new ServiceLoader(name);
  service* srv = sldr->create(srv_params);
  dlib_map[srv] = sldr;
  return srv;
}

SERVICE_METHOD_DEFINITION(Loader, destroy)
{
  exception_try
  service* srv = (service*) params;
  ServiceLoader* sldr = dlib_map[srv];
  if(sldr == 0) exception_throw_type(exception_type::null_pointer)
  sldr->destroy(srv);
  delete sldr;
  dlib_map.erase(srv);
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
