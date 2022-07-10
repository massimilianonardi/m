#include "serviceloader.h"

ServiceLoader::ServiceLoader(const Sequence& name, SERVICE_METHOD_PARAMETERS)//: dlib(0), srv(0)
{
  // new_name = LoaderAdvanced
  // new_params = name << params << la_params // la should use this process handle to have deteiled security management?
  // NB LoaderAdvanced must not use ServiceLoader otherwise an infinite loop will be caused. It must call dlib directly
//  dlib = new DynamicLibraryLoader(name);
//  srv = dlib->create(params);
  dlib = new DynamicLibraryLoader("Loader");
  Sequence loader_params = name;
  loader_params << params; // << la_params;
  srv = dlib->create(0);
  srv = &(Service&) srv->create(loader_params);
}

ServiceLoader::~ServiceLoader()
{
  debug_line
  if(dlib != 0)
  {
    debug_line
    dlib->destroy(srv);
    debug_line
    delete dlib;
    debug_line
  }
}

ServiceLoader::ServiceLoader(const ServiceLoader& orig): dlib(0), srv(0)
{
  debug_line
  *this = orig;
}

ServiceLoader& ServiceLoader::operator=(const ServiceLoader& orig)
{
  debug_line
  if(this == &orig) return *this;
  // release old resources, if any
  if(dlib != 0)
  {
    dlib->destroy(srv);
    delete dlib;
  }
  // transfer ownership to this
  dlib = orig.dlib;
  srv = orig.srv;
  const_cast<ServiceLoader&>(orig).dlib = 0;
  const_cast<ServiceLoader&>(orig).srv = 0;
  return *this;
}
