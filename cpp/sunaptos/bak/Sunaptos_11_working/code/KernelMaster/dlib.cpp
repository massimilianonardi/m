#include "dlib.h"

#include "kernelmaster.h"

extern "C"
{

DLIB_FUNCTION_EXPORT Object* create(Kernel* k)
{
  KernelMaster* srv = new KernelMaster(k);
  return dynamic_cast<Object*>(srv);
}

} // extern "C"
