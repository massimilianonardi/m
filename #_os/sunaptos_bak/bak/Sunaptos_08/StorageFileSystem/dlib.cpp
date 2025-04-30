#include "dlib.h"

#include "storagefilesystem.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "StorageFileSystem";
}

DLIB_FUNCTION_EXPORT bool check(Object* obj)
{
  StorageFileSystem* iface = dynamic_cast<StorageFileSystem*>(obj);
  if(iface)
  {
    return true;
  }
  else
  {
    return false;
  }
}

} // extern "C"
