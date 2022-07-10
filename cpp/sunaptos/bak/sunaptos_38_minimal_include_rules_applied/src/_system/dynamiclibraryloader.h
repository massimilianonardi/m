#ifndef _DYNAMICLIBRARYLOADER_H
#define	_DYNAMICLIBRARYLOADER_H

#ifdef WIN32
#include <windows.h>
#endif

//#include "service.h"
class Service;

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
    Service* create(Service* loader);
};

#endif	// _DYNAMICLIBRARYLOADER_H
