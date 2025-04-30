#ifndef DLIB_H
#define	DLIB_H

// platform specific -----------------------------------------------------------
#ifdef WIN32
#include <windows.h>
#define DLIB_HIDDEN
#define DLIB_EXPORT __declspec (dllexport)
#define DLIB_IMPORT __declspec (dllimport)
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
#define DLIB_HIDDEN __attribute__ ((__visibility__("hidden")))
#define DLIB_EXPORT __attribute__ ((__visibility__("default")))
#define DLIB_IMPORT
#define DLIB_MAIN
#else
#define DLIB_HIDDEN
#define DLIB_EXPORT
#define DLIB_IMPORT
#define DLIB_MAIN
#endif

// export/import differentiation -----------------------------------------------
//#ifdef DLIB_EXPORT_SYMBOLS
#ifdef DLIB__CORE
#define DLIB_EXTERN DLIB_EXPORT
#else
#define DLIB_EXTERN DLIB_IMPORT
#endif
//#undef DLIB_EXPORT
//#undef DLIB_IMPORT

#undef DLIB_EXTERN
#define DLIB_EXTERN __attribute__ ((__visibility__("default")))
#define DLIB_FUNCTION_EXPORT DLIB_EXTERN

//------------------------------------------------------------------------------

#endif	// DLIB_H
