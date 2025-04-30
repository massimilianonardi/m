#include "dlib.h"

#include "BootLoader_srv.h"

extern "C"
{

DLIB_FUNCTION_EXPORT CommandListener* create(Object* obj)
{
  BootLoader* srv = dynamic_cast<BootLoader*>(obj);
  // todo: if srv is null throw an exception
  BootLoader_srv* is = new BootLoader_srv(srv);
  return dynamic_cast<CommandListener*>(is);
}

} // extern "C"
