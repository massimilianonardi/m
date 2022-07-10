#include "dlib.h"

#include "storagefilesystem_cli.h"

extern "C"
{

DLIB_FUNCTION_EXPORT Object* create(CommandListener* cl)
{
  // todo: if cl is null throw an exception
  StorageFileSystem* is = new StorageFileSystem_cli(cl);
  return dynamic_cast<Object*>(is);
}

} // extern "C"
