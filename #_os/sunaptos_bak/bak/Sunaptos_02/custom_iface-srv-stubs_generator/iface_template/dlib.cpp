#include "dlib.h"

#include "iface_template.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "iface_template";
}

DLIB_FUNCTION_EXPORT bool check(Object* obj)
{
  iface_template* iface = dynamic_cast<iface_template*>(obj);
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
