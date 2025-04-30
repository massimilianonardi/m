#ifndef _BOOTLOADERSERVER_H
#define	_BOOTLOADERSERVER_H

#include "bootloader.h"
#include "loader.h"

class BootLoaderServer: virtual public BootLoader
{
  protected:
    Loader* loader;

  public:
    BootLoaderServer(Loader* loader);
    virtual ~BootLoaderServer();
    
    Sequence& boot(Sequence& params, Sequence& res);
};

#endif	// _BOOTLOADERSERVER_H
