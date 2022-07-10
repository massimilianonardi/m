#ifndef _DYNAMICLIBRARYLOADER_H
#define	_DYNAMICLIBRARYLOADER_H

#include "dlib.h"

#ifdef WIN32
#include <windows.h>
#endif

class DynamicLibraryLoader
{
public:
  DynamicLibraryLoader(const char* name);
  virtual ~DynamicLibraryLoader();
  void* getFuncAddress(const char* name);
  void* try_getFuncAddress(const char* name);

protected:
private:
#ifdef WIN32
  HINSTANCE hinst;
#elif defined LINUX
  void* hinst;
#else
#endif
  DynamicLibraryLoader(const DynamicLibraryLoader& dll) = delete;
  DynamicLibraryLoader& operator=(const DynamicLibraryLoader& dll) = delete;
};

#endif	// _DYNAMICLIBRARYLOADER_H
