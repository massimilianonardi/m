#ifndef _SRV_TEMPLATE_H
#define	_SRV_TEMPLATE_H

#include "remoteloader.h"
#include "loader.h"
#include "commandlistener.h"
#include "servicestarter.h"
#include "ipcserver.h"

#include <map>
#include <string>
using namespace std;
typedef map<string, IPCServer*> ConnectiosContainer;
typedef map<string, ServiceStarter*> ServiceStarterContainer;

class RemoteLoaderServer: virtual public RemoteLoader
{
  protected:
    CommandListener* cl;
//    ServiceStarter* ss;
    ConnectiosContainer cc;
    ServiceStarterContainer ss;
    
  public:
    RemoteLoaderServer(Loader* loader);
    virtual ~RemoteLoaderServer();
    
    Data* getInterface(Data* data);
    Data* getService(Data* data);
    Data* setLoaderListener(Data* data);
};

#endif	// _SRV_TEMPLATE_H
