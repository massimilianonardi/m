#include "dlib.h"

#include "storagefilesystem_srv.h"

extern "C"
{

DLIB_FUNCTION_EXPORT CommandListener* create(Object* obj)
{
  StorageFileSystem* srv = dynamic_cast<StorageFileSystem*>(obj);
  // todo: if srv is null throw an exception
  StorageFileSystem_srv* is = new StorageFileSystem_srv(srv);
  return dynamic_cast<CommandListener*>(is);
}

} // extern "C"
