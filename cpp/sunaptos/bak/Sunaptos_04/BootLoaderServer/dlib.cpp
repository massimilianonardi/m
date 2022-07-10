#include "dlib.h"

#include "BootLoaderServer.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "BootLoaderServer";
}

DLIB_FUNCTION_EXPORT Object* create(Loader* loader)
{
  BootLoaderServer* srv = new BootLoaderServer(loader);
  return dynamic_cast<Object*>(srv);
}

} // extern "C"
