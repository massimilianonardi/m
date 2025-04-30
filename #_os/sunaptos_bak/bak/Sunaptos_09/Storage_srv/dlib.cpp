#include "dlib.h"

#include "storage_srv.h"

extern "C"
{

DLIB_FUNCTION_EXPORT CommandListener* create(Object* obj)
{
  Storage* srv = dynamic_cast<Storage*>(obj);
  // todo: if srv is null throw an exception
  Storage_srv* is = new Storage_srv(srv);
  return dynamic_cast<CommandListener*>(is);
}

} // extern "C"
