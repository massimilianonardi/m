#include "dlib.h"

#include "servicestarter.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "ServiceStarter";
}

DLIB_FUNCTION_EXPORT bool check(Object* obj)
{
  ServiceStarter* iface = dynamic_cast<ServiceStarter*>(obj);
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
