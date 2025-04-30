#include "dlib.h"

#include "srv_sample.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "srv_sample";
}

DLIB_FUNCTION_EXPORT Object* create(Loader* loader)
{
  srv_sample* srv = new srv_sample(loader);
  return dynamic_cast<Object*>(srv);
}

} // extern "C"
