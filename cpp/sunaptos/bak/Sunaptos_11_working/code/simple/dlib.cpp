#include "dlib.h"

#include "simple.h"

extern "C"
{

DLIB_FUNCTION_EXPORT Object* create(Kernel* k)
{
  Simple* srv = new Simple(k);
  return dynamic_cast<Object*>(srv);
}

} // extern "C"
