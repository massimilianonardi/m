#ifndef _REMOTELOADERSERVER_H
#define	_REMOTELOADERSERVER_H

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
    
    Sequence& getInterface(Sequence& params, Sequence& res);
    Sequence& getService(Sequence& params, Sequence& res);
    Sequence& setLoaderListener(Sequence& params, Sequence& res);
};

#endif	// _REMOTELOADERSERVER_H
