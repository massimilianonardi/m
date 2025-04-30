#include "LoaderLocal.h"

#include "ServiceLoader.h"

LoaderLocal::LoaderLocal(SERVICE_METHOD_PARAMETERS)
{
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
  return *((new ServiceLoader(name))->create(srv_params)); // memory leak but should be recovered when this dlib is released
}

SERVICE_METHOD_DEFINITION(LoaderLocal, destroy)
{
  debug_line
//  return SERVICE_NULL;
  exception_try
//  if(params == empty_sequence) process_unlock();
  // TODO: use the corresponding dlib to destroy
//  dlib.destroy(obj);
  delete (Service*) params;
  return SERVICE_NULL;
  exception_catch_print
  return SERVICE_ERROR;
  exception_end
}
