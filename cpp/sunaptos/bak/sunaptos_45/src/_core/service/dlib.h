#ifndef DLIB_H
#define	DLIB_H

#ifdef WIN32
#include <windows.h>
#define DLIB_FUNCTION_EXPORT __declspec (dllexport)
#define DLIB_MAIN \
BOOL APIENTRY DllMain(HINSTANCE hInst, DWORD reason, LPVOID reserved)\
{\
  switch (reason)\
  {\
    case DLL_PROCESS_ATTACH:\
      break;\
    case DLL_PROCESS_DETACH:\
      break;\
    case DLL_THREAD_ATTACH:\
      break;\
    case DLL_THREAD_DETACH:\
      break;\
  }\
  return TRUE;\
}
#elif defined LINUX
#define DLIB_FUNCTION_EXPORT __attribute__ ((__visibility__("default")))
#define DLIB_MAIN
#else
#define DLIB_FUNCTION_EXPORT
#define DLIB_MAIN
#endif

#include "sequence.h"
#include "object.h"
#include "service.h"
#include "exception.h"

#define SERVICE_EXPORT(class_name)\
DLIB_MAIN\
;\
extern "C"\
{\
\
DLIB_FUNCTION_EXPORT Sequence* info()\
{\
  Sequence* info = new Sequence();\
  return info;\
}\
\
DLIB_FUNCTION_EXPORT Service* create(SERVICE_METHOD_PARAMETERS)\
{\
  return new class_name(params);\
}\
\
DLIB_FUNCTION_EXPORT void destroy(const Service* obj)\
{\
  delete obj;\
}\
\
DLIB_FUNCTION_EXPORT Service* try_create(SERVICE_METHOD_PARAMETERS)\
{\
  exception_try\
  return create(params);\
  exception_catch_print\
  return (Service*) SERVICE_ERROR;\
  exception_end\
}\
\
DLIB_FUNCTION_EXPORT SERVICE_METHOD_RETURN_TYPE try_destroy(const Service* obj)\
{\
  exception_try\
  destroy(obj);\
  return SERVICE_NULL;\
  exception_catch_print\
  return SERVICE_ERROR;\
  exception_end\
}\
\
} // extern "C"

#endif	// DLIB_H
