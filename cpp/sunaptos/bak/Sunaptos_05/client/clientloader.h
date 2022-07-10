#ifndef _CLIENTLOADER_H
#define	_CLIENTLOADER_H

#include "object.h"
#include "loader.h"
#include "servicestarter.h"
#include "remoteloader.h"

#include "ipcclient.h"
#include "ipcserver.h"

#include "dlibobj.h"
#include "dlibcli.h"
#include "dlibsrv.h"

#include <map>
#include <string>
using namespace std;
typedef map<string, Object*> ObjectsContainer;
typedef map<string, DLibObj*> ServiceDLibsContainer;
typedef map<string, DLibCli*> ServiceWrapperDLibsContainer;

class ClientLoader: virtual public Loader, virtual public ServiceStarter
{
  protected:
    ObjectsContainer objects;
    ObjectsContainer objects_remote;
    ServiceDLibsContainer services;
    ServiceWrapperDLibsContainer services_remote;
    RemoteLoader* rl;
    Object* obj;
    const char* iface_name;
//    IPCClient* ipcc;
//    DLibCli* dlibc;
    
  public:
    ClientLoader();
    ~ClientLoader();

    void init(const char* lkey, const char* name, const char* iface, const char* key);
    
    Object* getInterface(const char* ifn, const char* sn = 0, bool remote = false);
    Object* getService(const char* sn, bool remote = false);

    Data* createServiceChannel(Data* data);

//  private:
    Object* getServiceLocal(const char* name, const char* id);
    Object* getServiceRemote(const char* name, const char* key);
    void createServiceRemoteChannel(Object* obj, const char* name, const char* key);
};

#endif	// _CLIENTLOADER_H
