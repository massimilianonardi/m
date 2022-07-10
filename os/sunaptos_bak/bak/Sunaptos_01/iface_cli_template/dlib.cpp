#include "dlib.h"

#include "iface_cli_template.h"

extern "C"
{

DLIB_FUNCTION_EXPORT Object* create(CommandListener* cl)
{
  // todo: if cl is null throw an exception
  iface_cli_template* is = new iface_cli_template(cl);
  return dynamic_cast<Object*>(is);
}

} // extern "C"
