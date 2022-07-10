#include "dlib.h"

#include "iface_template_cli.h"

extern "C"
{

DLIB_FUNCTION_EXPORT Object* create(CommandListener* cl)
{
  // todo: if cl is null throw an exception
  iface_template* is = new iface_template_cli(cl);
  return dynamic_cast<Object*>(is);
}

} // extern "C"
