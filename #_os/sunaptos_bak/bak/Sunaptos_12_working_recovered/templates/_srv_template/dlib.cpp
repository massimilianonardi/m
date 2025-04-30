#include "dlib.h"

#include "template.h"

extern "C"
{

DLIB_FUNCTION_EXPORT Object* create(Service* k)
{
  template_class* srv = new template_class(k);
  return dynamic_cast<Object*>(srv);
}

} // extern "C"
