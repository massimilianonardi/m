#include "dlib.h"

#include "remoteloaderserver.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "RemoteLoaderServer";
}

DLIB_FUNCTION_EXPORT Object* create(Loader* loader)
{
  RemoteLoaderServer* srv = new RemoteLoaderServer(loader);
  return dynamic_cast<Object*>(srv);
}

} // extern "C"
