#include "dlib.h"

#include "storage.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "Storage";
}

DLIB_FUNCTION_EXPORT bool check(Object* obj)
{
  Storage* iface = dynamic_cast<Storage*>(obj);
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
