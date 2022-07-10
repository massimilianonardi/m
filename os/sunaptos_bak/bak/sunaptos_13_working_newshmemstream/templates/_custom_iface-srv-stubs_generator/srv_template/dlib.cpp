#include "dlib.h"

#include "template_file_name.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "template_class";
}

DLIB_FUNCTION_EXPORT Object* create(Loader* loader)
{
  template_class* srv = new template_class(loader);
  return dynamic_cast<Object*>(srv);
}

} // extern "C"
