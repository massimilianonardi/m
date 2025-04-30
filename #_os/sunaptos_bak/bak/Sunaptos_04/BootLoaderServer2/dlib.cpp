#include "dlib.h"

#include "BootLoaderServer2.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "BootLoaderServer2";
}

DLIB_FUNCTION_EXPORT Object* create(Loader* loader)
{
  BootLoaderServer2* srv = new BootLoaderServer2(loader);
  return dynamic_cast<Object*>(srv);
}

} // extern "C"
