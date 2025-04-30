#include "dlib.h"

#include "iface_srv_template.h"

extern "C"
{

DLIB_FUNCTION_EXPORT CommandListener* create(Object* obj)
{
  iface_template* srv = dynamic_cast<iface_template*>(obj);
  // todo: if srv is null throw an exception
  iface_srv_template* is = new iface_srv_template(srv);
  return dynamic_cast<CommandListener*>(is);
}

} // extern "C"
