#ifndef _BOOTLOADERSERVER2_H
#define	_BOOTLOADERSERVER2_H

#include "bootloader.h"
#include "loader.h"

class BootLoaderServer2: virtual public BootLoader
{
  public:
    BootLoaderServer2(Loader* loader);
    virtual ~BootLoaderServer2();
    
    Sequence& boot(Sequence& params, Sequence& res);
};

#endif	// _BOOTLOADERSERVER2_H
