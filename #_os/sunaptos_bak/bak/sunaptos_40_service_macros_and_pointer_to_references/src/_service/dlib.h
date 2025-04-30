#ifndef DLIB_H
#define	DLIB_H

// depends on the following defines
//#define SERVICE_INCLUDE_FILE "service_include_file.h"
//#define SERVICE_CLASS_NAME ServiceClassName

#ifdef WIN32
#include <windows.h>
#define DLIB_FUNCTION_EXPORT __declspec (dllexport)
BOOL APIENTRY DllMain(HINSTANCE hInst, DWORD reason, LPVOID reserved)
{
  switch (reason)
  {
    case DLL_PROCESS_ATTACH:
      break;
    case DLL_PROCESS_DETACH:
      break;
    case DLL_THREAD_ATTACH:
      break;
    case DLL_THREAD_DETACH:
      break;
  }
  return TRUE;
}
#elif defined LINUX
#define DLIB_FUNCTION_EXPORT __attribute__ ((__visibility__("default")))
#else
#define DLIB_FUNCTION_EXPORT
#endif

#include "sequence.h"
#include "object.h"
#include "service.h"

extern "C"
{

DLIB_FUNCTION_EXPORT Sequence* info()
{
  Sequence* info = new Sequence();
//  info << "iface_name" << iface_version_integer << "iface_version_text" << "srv_name" << srv_version_integer << "srv_version_text" << "custom info";
  return info;
}

DLIB_FUNCTION_EXPORT Object* create(Object* k)
{
  Service* srv = new SERVICE_CLASS_NAME(dynamic_cast<Service*>(k));
  return dynamic_cast<Object*>(srv);
}

} // extern "C"

#endif	// DLIB_H
