#ifndef _REMOTELOADER_CLI_H
#define	_REMOTELOADER_CLI_H

#include "remoteloader.h"
#include "commandlistener.h"

class RemoteLoader_cli: virtual public RemoteLoader
{
  private:
    CommandListener* cl;
    
  public:
    RemoteLoader_cli(CommandListener* cl);
    virtual ~RemoteLoader_cli();
    
    Sequence& getInterface(Sequence& params, Sequence& res);
    Sequence& getService(Sequence& params, Sequence& res);
    Sequence& setLoaderListener(Sequence& params, Sequence& res);
};

#endif	// _REMOTELOADER_CLI_H
