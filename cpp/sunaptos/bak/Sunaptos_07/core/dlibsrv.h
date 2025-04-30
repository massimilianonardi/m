#ifndef _DLIBSRV_H
#define	_DLIBSRV_H

#include "dynamiclibraryloader.h"
#include "object.h"
#include "commandlistener.h"

class DLibSrv: public DynamicLibraryLoader
{
  public:
    DLibSrv(const char* name);
    virtual ~DLibSrv();
    
    CommandListener* create(Object* obj);
};

#endif	// _DLIBSRV_H
