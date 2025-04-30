#ifndef _DYNAMICLIBRARYLOADER_H
#define	_DYNAMICLIBRARYLOADER_H

#include "sequence.h"
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
    
  public:
    DynamicLibraryLoader(char* name);
    virtual ~DynamicLibraryLoader();
    
    void* getFuncAddress(char* name);
    Service* create(Service* loader);
};

#endif	// _DYNAMICLIBRARYLOADER_H
