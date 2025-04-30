#include "dlib.h"

#include "boot.h"

extern "C"
{

DLIB_FUNCTION_EXPORT Object* create(Kernel* k)
{
  Boot* srv = new Boot(k);
  return dynamic_cast<Object*>(srv);
}

} // extern "C"
