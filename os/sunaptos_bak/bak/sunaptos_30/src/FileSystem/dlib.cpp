#include "dlib.h"

#include "filesystem.h"

extern "C"
{

DLIB_FUNCTION_EXPORT sequence* info()
{
  sequence* info = new sequence();
//  info << "iface_name" << iface_version_integer << "iface_version_text" << "srv_name" << srv_version_integer << "srv_version_text" << "custom info";
  return info;
}

DLIB_FUNCTION_EXPORT Object* create(Service* k)
{
  Service* srv = new FileSystem(k);
  return dynamic_cast<Object*>(srv);
}

} // extern "C"
