#include "dlib.h"

#include "servicestarter_cli.h"

extern "C"
{

DLIB_FUNCTION_EXPORT Object* create(CommandListener* cl)
{
  // todo: if cl is null throw an exception
  ServiceStarter* is = new ServiceStarter_cli(cl);
  return dynamic_cast<Object*>(is);
}

} // extern "C"
