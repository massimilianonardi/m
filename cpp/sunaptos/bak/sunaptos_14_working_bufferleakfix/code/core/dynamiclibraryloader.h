#ifndef _DYNAMICLIBRARYLOADER_H
#define	_DYNAMICLIBRARYLOADER_H

#include <windows.h>

#include "sequence.h"
#include "service.h"

class DynamicLibraryLoader
{
  protected:
    HINSTANCE hinst;
    
  public:
    DynamicLibraryLoader(Sequence& name);
    virtual ~DynamicLibraryLoader();
    
    void* getFuncAddress(Sequence& name);
    Service* create(Service* loader);
};

#endif	// _DYNAMICLIBRARYLOADER_H
