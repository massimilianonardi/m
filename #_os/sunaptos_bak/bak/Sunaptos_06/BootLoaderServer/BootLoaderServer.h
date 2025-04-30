#ifndef _BootLoaderServer_H
#define	_BootLoaderServer_H

#include "BootLoader.h"
#include "loader.h"

class BootLoaderServer: virtual public BootLoader
{
  protected:
    Loader* loader;

  public:
    BootLoaderServer(Loader* loader);
    virtual ~BootLoaderServer();
    
    Data* boot(Data* data);
};

#endif	// _BootLoaderServer_H
