#include "dlib.h"

#include "iface_template_srv.h"

extern "C"
{

DLIB_FUNCTION_EXPORT CommandListener* create(Object* obj)
{
  iface_template* srv = dynamic_cast<iface_template*>(obj);
  // todo: if srv is null throw an exception
  iface_template_srv* is = new iface_template_srv(srv);
  return dynamic_cast<CommandListener*>(is);
}

} // extern "C"
