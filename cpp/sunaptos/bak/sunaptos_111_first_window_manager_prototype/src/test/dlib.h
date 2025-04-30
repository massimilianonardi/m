#ifndef DLIB_H
#define	DLIB_H

#ifdef WIN32
#include <windows.h>
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
#define DLIB_MAIN
#else
#define DLIB_MAIN
#endif

#endif	// DLIB_H
