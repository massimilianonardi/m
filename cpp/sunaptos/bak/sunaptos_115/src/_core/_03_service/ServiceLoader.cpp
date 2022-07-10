#include "ServiceLoader.h"

service* ServiceLoader::create(SERVICE_METHOD_PARAMETERS)
{
  typedef service* (*Constructor)(SERVICE_METHOD_PARAMETERS);
  return (*((Constructor) getFuncAddress("create")))(params);
}

void ServiceLoader::destroy(const service* params)
{
  typedef void (*Destructor)(const service*);
  (*((Destructor) getFuncAddress("destroy")))(params);
}

service* ServiceLoader::try_create(SERVICE_METHOD_PARAMETERS)
{
  typedef service* (*Constructor)(SERVICE_METHOD_PARAMETERS);
  service* srv = (*((Constructor) try_getFuncAddress("try_create")))(params);
  if((long long) srv == SERVICE_ERROR) exception_throw_type(exception_type::null_pointer)
  return srv;
}

void ServiceLoader::try_destroy(const service* params)
{
  typedef SERVICE_METHOD_RETURN_TYPE (*Destructor)(const service*);
  SERVICE_METHOD_RETURN_TYPE res = (*((Destructor) try_getFuncAddress("try_destroy")))(params);
  if(res == (sequence) SERVICE_ERROR) exception_throw_type(exception_type::null_pointer)
}
