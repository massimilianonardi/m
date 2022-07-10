#include "ServiceLoader.h"

Service* ServiceLoader::create(SERVICE_METHOD_PARAMETERS)
{
  typedef Service* (*Constructor)(SERVICE_METHOD_PARAMETERS);
  return (*((Constructor) getFuncAddress("create")))(params);
}

void ServiceLoader::destroy(const Service* params)
{
  typedef void (*Destructor)(const Service*);
  (*((Destructor) getFuncAddress("destroy")))(params);
}

Service* ServiceLoader::try_create(SERVICE_METHOD_PARAMETERS)
{
  typedef Service* (*Constructor)(SERVICE_METHOD_PARAMETERS);
  Service* srv = (*((Constructor) try_getFuncAddress("try_create")))(params);
  if((long) srv == SERVICE_ERROR) exception_throw_type(Exception::null_pointer)
  return srv;
}

void ServiceLoader::try_destroy(const Service* params)
{
  typedef SERVICE_METHOD_RETURN_TYPE (*Destructor)(const Service*);
  SERVICE_METHOD_RETURN_TYPE res = (*((Destructor) try_getFuncAddress("try_destroy")))(params);
  if(res == (Sequence) SERVICE_ERROR) exception_throw_type(Exception::null_pointer)
}
