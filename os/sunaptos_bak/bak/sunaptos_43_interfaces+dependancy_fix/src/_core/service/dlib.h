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
DLIB_FUNCTION_EXPORT Object* create(Object* k)\
{\
  exception_try\
  Service* srv = new class_name(dynamic_cast<Service*>(k));\
  return dynamic_cast<Object*>(srv);\
  exception_catch_print\
  return 0;\
  exception_end\
}\
\
} // extern "C"

#endif	// DLIB_H
