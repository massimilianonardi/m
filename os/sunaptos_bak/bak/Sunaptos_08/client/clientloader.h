#ifndef _CLIENTLOADER_H
#define	_CLIENTLOADER_H

#include "object.h"
#include "loader.h"
#include "servicestarter.h"
#include "remoteloader.h"

class ClientLoader: virtual public Loader, virtual public ServiceStarter, virtual public Object
{
  protected:
    RemoteLoader* rl;
    Object* obj;
    const char* iface_name;
    
  public:
    ClientLoader();
    ~ClientLoader();

    void init(const char* lkey, const char* name, const char* iface, const char* key);
    
    Object* getInterface(const char* ifn, const char* sn = 0, bool remote = false);
    Object* getService(const char* sn, bool remote = false);

    Sequence& createServiceChannel(Sequence& params, Sequence& res);

//  private:
    Object* getServiceLocal(const char* name, const char* id);
    Object* getServiceRemote(const char* name, const char* key);
    void createServiceRemoteChannel(Object* obj, const char* name, const char* key);
};

#endif	// _CLIENTLOADER_H
