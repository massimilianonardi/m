#include "dlib.h"

#include "servicestarter_srv.h"

extern "C"
{

DLIB_FUNCTION_EXPORT CommandListener* create(Object* obj)
{
  ServiceStarter* srv = dynamic_cast<ServiceStarter*>(obj);
  // todo: if srv is null throw an exception
  ServiceStarter_srv* is = new ServiceStarter_srv(srv);
  return dynamic_cast<CommandListener*>(is);
}

} // extern "C"
