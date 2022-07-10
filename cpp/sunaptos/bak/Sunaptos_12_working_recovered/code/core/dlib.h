#ifndef _DLIB_H
#define	_DLIB_H

#define DLIB_FUNCTION_EXPORT

#if defined(_WIN32) || defined(WIN32)
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
#endif	// _WIN32 || WIN32

#endif	// _DLIB_H
