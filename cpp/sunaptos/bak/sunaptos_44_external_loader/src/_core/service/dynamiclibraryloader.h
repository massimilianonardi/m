#ifndef _DYNAMICLIBRARYLOADER_H
#define	_DYNAMICLIBRARYLOADER_H

#ifdef WIN32
#include <windows.h>
#endif

#include "service.h"

class DynamicLibraryLoader
{
protected:
#ifdef WIN32
  HINSTANCE hinst;
#elif defined LINUX
  void* hinst;
#else
#endif
  inline DynamicLibraryLoader(const DynamicLibraryLoader& dll){};
  inline DynamicLibraryLoader& operator=(const DynamicLibraryLoader& dll){};
  void* getFuncAddress(const char* name);
  void* try_getFuncAddress(const char* name);

public:
  DynamicLibraryLoader(const char* name);
  virtual ~DynamicLibraryLoader();

  Service* create(SERVICE_METHOD_PARAMETERS);
  void destroy(const Service* params);
  Service* try_create(SERVICE_METHOD_PARAMETERS);
  void try_destroy(const Service* params);
};

#endif	// _DYNAMICLIBRARYLOADER_H
