#ifndef _DYNAMICLIBRARYLOADER_H
#define	_DYNAMICLIBRARYLOADER_H

//#include "service.h"
class Service;

#include "system.h"

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
