#ifndef _SRV_TEMPLATE_H
#define	_SRV_TEMPLATE_H

#include "remoteloader.h"
#include "loader.h"
#include "commandlistener.h"
#include "ipcserver.h"

#include <map>
#include <string>
using namespace std;
typedef map<string, IPCServer*> ConnectiosContainer;

class RemoteLoaderServer: virtual public RemoteLoader
{
  protected:
    CommandListener* cl;
    ConnectiosContainer cc;
    
  public:
    RemoteLoaderServer(Loader* loader);
    virtual ~RemoteLoaderServer();
    
    Data* getInterface(Data* data);
    Data* getService(Data* data);
};

#endif	// _SRV_TEMPLATE_H
