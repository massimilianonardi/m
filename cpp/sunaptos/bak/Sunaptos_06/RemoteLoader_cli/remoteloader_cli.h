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
    
    Data* getInterface(Data* data);
    Data* getService(Data* data);
    Data* setLoaderListener(Data* data);
};

#endif	// _REMOTELOADER_CLI_H
