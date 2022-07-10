#include "dlib.h"

#include "bootloader.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "BootLoader";
}

DLIB_FUNCTION_EXPORT bool check(Object* obj)
{
  BootLoader* iface = dynamic_cast<BootLoader*>(obj);
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
