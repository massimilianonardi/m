#include "Loader.h"

Loader::Loader(SERVICE_METHOD_PARAMETERS)
{
}

Loader::~Loader()
{
}

SERVICE_REGISTER(Loader)
SERVICE_REGISTER_END

SERVICE_METHOD_DEFINITION(Loader, create)
{
  const char *name = params;
  Sequence srv_params = params(0);
  // TODO: names starting with '.' are ufn and may refer to another pc, without the dot are strictly local...better convention must be decided!!!
  if(name[0] != '.')
  {
    debug_line
    return *((new DynamicLibraryLoader(name))->create(srv_params)); // memory leak but should be recovered when this dlib is released
  }
  else
  {
    debug_line
    name = ((const char*) params) + 1;
    Sequence srv_params = params;
    srv_params = name;
    DynamicLibraryLoader* dlib = new DynamicLibraryLoader("LoaderAdvanced");
    Service* la = dlib->create(0);
    return la->create(srv_params); // memory leak but should be recovered when this dlib is released
  }
}

SERVICE_METHOD_DEFINITION(Loader, destroy)
{
}

SERVICE_METHOD_DEFINITION(Loader, notify)
{
}
