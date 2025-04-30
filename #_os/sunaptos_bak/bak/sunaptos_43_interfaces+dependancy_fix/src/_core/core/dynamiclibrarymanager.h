#ifndef _DYNAMICLIBRARYMANAGER_H
#define	_DYNAMICLIBRARYMANAGER_H

#include <map>

#include "service.h"
#include "dynamiclibraryloader.h"

typedef std::map<Service*, DynamicLibraryLoader*> SrvDLibMap;

class DynamicLibraryManager
{
  protected:
    SrvDLibMap sdlm;

  public:
    DynamicLibraryManager();
    virtual ~DynamicLibraryManager();

//    Service* create(char* name, Service* loader);
//    bool destroy(Service* service);
    Service& create(char* name, Service* loader);
    bool destroy(Service& service);
};

#endif	// _DYNAMICLIBRARYMANAGER_H
