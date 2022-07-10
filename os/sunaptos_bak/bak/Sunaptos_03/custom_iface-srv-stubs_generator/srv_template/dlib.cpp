#include "dlib.h"

#include "srv_template.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "srv_template";
}

DLIB_FUNCTION_EXPORT Object* create(Loader* loader)
{
  srv_template* srv = new srv_template(loader);
  return dynamic_cast<Object*>(srv);
}

} // extern "C"
