#include "dlib.h"

#include "remoteloader_srv.h"

extern "C"
{

DLIB_FUNCTION_EXPORT CommandListener* create(Object* obj)
{
  RemoteLoader* srv = dynamic_cast<RemoteLoader*>(obj);
  // todo: if srv is null throw an exception
  RemoteLoader_srv* is = new RemoteLoader_srv(srv);
  return dynamic_cast<CommandListener*>(is);
}

} // extern "C"
