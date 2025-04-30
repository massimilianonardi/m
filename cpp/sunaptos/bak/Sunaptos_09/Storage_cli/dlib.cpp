#include "dlib.h"

#include "storage_cli.h"

extern "C"
{

DLIB_FUNCTION_EXPORT Object* create(CommandListener* cl)
{
  // todo: if cl is null throw an exception
  Storage* is = new Storage_cli(cl);
  return dynamic_cast<Object*>(is);
}

} // extern "C"
