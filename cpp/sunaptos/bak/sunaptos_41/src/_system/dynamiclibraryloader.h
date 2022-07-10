#ifndef _DYNAMICLIBRARYLOADER_H
#define	_DYNAMICLIBRARYLOADER_H

#ifdef WIN32
#include <windows.h>
#endif

#include "object.h"

class DynamicLibraryLoader
{
protected:
#ifdef WIN32
  HINSTANCE hinst;
#elif defined LINUX
  void* hinst;
#else
#endif

public:
  DynamicLibraryLoader(char* name);
  virtual ~DynamicLibraryLoader();

  void* getFuncAddress(char* name);
  Object* create(Object* loader);
};

#endif	// _DYNAMICLIBRARYLOADER_H
