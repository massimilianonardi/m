#include "dlib.h"

#include "storagefilesystemserver.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "StorageFileSystemServer";
}

DLIB_FUNCTION_EXPORT Object* create(Loader* loader)
{
  StorageFileSystemServer* srv = new StorageFileSystemServer(loader);
  return dynamic_cast<Object*>(srv);
}

} // extern "C"
