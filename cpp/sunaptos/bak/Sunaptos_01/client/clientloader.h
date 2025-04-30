#ifndef _CLIENTLOADER_H
#define	_CLIENTLOADER_H

#include "object.h"
#include "loader.h"
#include "dlibobj.h"
#include "dlibcli.h"

#include <map>
#include <string>
using namespace std;
//typedef map<string, Object*> ObjectsContainer;
typedef map<string, DLibObj*> ServiceDLibsContainer;
typedef map<string, DLibCli*> ServiceWrapperDLibsContainer;

class ClientLoader: virtual public Loader
{
  protected:
    //ObjectsContainer objects;
    ServiceDLibsContainer services;
    ServiceWrapperDLibsContainer services_remote;
    
  public:
    ClientLoader(const char* ipc_loader_key);
    ~ClientLoader();
    
    void setSecurityManager(const char* name);
    // todo: add a method to delete an active object via the loader
    
    Object* getInterface(const char* name);
    Object* getInterface(const char* name, const char* srv);
    Object* getService(const char* name);
    Object* getInterfaceRemote(const char* name);
    Object* getInterfaceRemote(const char* name, const char* srv);
    Object* getServiceRemote(const char* name);
};

#endif	// _CLIENTLOADER_H
