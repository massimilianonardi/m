#include "dlib.h"

#include "storageosfs.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "StorageOSFS";
}

DLIB_FUNCTION_EXPORT Object* create(Loader* loader)
{
  StorageOSFS* srv = new StorageOSFS(loader);
  return dynamic_cast<Object*>(srv);
}

} // extern "C"
