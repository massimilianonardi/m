#ifndef _DYNAMICLIBRARYMANAGER_H
#define	_DYNAMICLIBRARYMANAGER_H

#include "object.h"
#include "kernel.h"

#include "dynamiclibraryloader.h"

#include <map>
using namespace std;

typedef map<Service*, DynamicLibraryLoader*> SrvDLibMap;

class DynamicLibraryManager
{
  protected:
    SrvDLibMap sdlm;

  public:
    DynamicLibraryManager();
    virtual ~DynamicLibraryManager();

    Service* create(Sequence& name, Kernel* loader);
    bool destroy(Service* service);
};

#endif	// _DYNAMICLIBRARYMANAGER_H
