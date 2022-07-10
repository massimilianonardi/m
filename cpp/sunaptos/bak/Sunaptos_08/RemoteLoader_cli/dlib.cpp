#include "dlib.h"

#include "remoteloader_cli.h"

extern "C"
{

DLIB_FUNCTION_EXPORT Object* create(CommandListener* cl)
{
  // todo: if cl is null throw an exception
  RemoteLoader* is = new RemoteLoader_cli(cl);
  return dynamic_cast<Object*>(is);
}

} // extern "C"
