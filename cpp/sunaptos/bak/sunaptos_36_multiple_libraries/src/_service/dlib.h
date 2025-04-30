#ifndef DLIB_H
#define	DLIB_H

#ifdef linux
#define LINUX
#endif

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
// todo: linux includes
#define DLIB_FUNCTION_EXPORT __attribute__ ((__visibility__("default")))
#else
#define DLIB_FUNCTION_EXPORT
#endif	// _WIN32 || WIN32

#endif	// DLIB_H
