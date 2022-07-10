#include "dlib.h"

#include "bootloader_cli.h"

extern "C"
{

DLIB_FUNCTION_EXPORT Object* create(CommandListener* cl)
{
  // todo: if cl is null throw an exception
  BootLoader* is = new BootLoader_cli(cl);
  return dynamic_cast<Object*>(is);
}

} // extern "C"
