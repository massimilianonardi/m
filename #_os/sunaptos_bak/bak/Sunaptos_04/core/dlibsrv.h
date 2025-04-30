#ifndef _DLIBSRV_H
#define	_DLIBSRV_H

#include "dynamiclibraryloader.h"
#include "object.h"
#include "commandlistener.h"

class DLibSrv: public DynamicLibraryLoader
{
  public:
    DLibSrv(const char* name) throw (const char*);
    
    CommandListener* create(Object* obj) throw (const char*);
};

#endif	// _DLIBSRV_H
