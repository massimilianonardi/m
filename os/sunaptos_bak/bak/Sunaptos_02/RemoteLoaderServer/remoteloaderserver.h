#ifndef _SRV_TEMPLATE_H
#define	_SRV_TEMPLATE_H

#include "remoteloader.h"
#include "commandlistener.h"
#include "loader.h"

class RemoteLoaderServer: virtual public RemoteLoader
{
  protected:
    CommandListener* cl;
    
  public:
    RemoteLoaderServer(Loader* loader);
    virtual ~RemoteLoaderServer();
    
    Data* getInterface(Data* data);
    Data* getService(Data* data);
};

#endif	// _SRV_TEMPLATE_H
