#ifndef _REMOTELOADER_SRV_H
#define	_REMOTELOADER_SRV_H

#include "remoteloader.h"
#include "commandlistener.h"

class RemoteLoader_srv: virtual public CommandListener
{
  private:
    RemoteLoader* srv;
    
  public:
    RemoteLoader_srv(RemoteLoader* srv);
    virtual ~RemoteLoader_srv();
    
    Sequence& processCommand(int cmd, Sequence& params, Sequence& res);
};

#endif	// _REMOTELOADER_SRV_H
