#ifndef _DYNAMICLIBRARYLOADER_H
#define	_DYNAMICLIBRARYLOADER_H

#include <windows.h>

class DynamicLibraryLoader
{
  protected:
    HINSTANCE hinst;
    
  public:
    DynamicLibraryLoader(const char* name) throw (const char*);
    virtual ~DynamicLibraryLoader();
    
    void* getFuncAddress(const char* name) throw (const char*);
};

#endif	// _DYNAMICLIBRARYLOADER_H
