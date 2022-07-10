#include "dlib.h"

#include "remoteloader.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "RemoteLoader";
}

DLIB_FUNCTION_EXPORT bool check(Object* obj)
{
  RemoteLoader* iface = dynamic_cast<RemoteLoader*>(obj);
  if(iface)
  {
    return true;
  }
  else
  {
    return false;
  }
}

} // extern "C"
