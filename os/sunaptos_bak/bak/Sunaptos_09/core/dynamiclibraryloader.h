#ifndef _DYNAMICLIBRARYLOADER_H
#define	_DYNAMICLIBRARYLOADER_H

#include <windows.h>

class DynamicLibraryLoader
{
  protected:
    HINSTANCE hinst;
    
  public:
    DynamicLibraryLoader(const char* name);
    virtual ~DynamicLibraryLoader();
    
    void* getFuncAddress(const char* name);
};

#endif	// _DYNAMICLIBRARYLOADER_H
