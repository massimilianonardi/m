#ifndef _DLIBOBJ_H
#define	_DLIBOBJ_H

#include "dynamiclibraryloader.h"
#include "object.h"
#include "loader.h"

class DLibObj: public DynamicLibraryLoader
{
  public:
    DLibObj(const char* name);
    virtual ~DLibObj();
    
    Object* create(Loader* loader);
};

#endif	// _DLIBOBJ_H
