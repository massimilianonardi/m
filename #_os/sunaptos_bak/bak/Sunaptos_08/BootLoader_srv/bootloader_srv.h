#ifndef _BOOTLOADER_SRV_H
#define	_BOOTLOADER_SRV_H

#include "bootloader.h"
#include "commandlistener.h"

class BootLoader_srv: virtual public CommandListener
{
  private:
    BootLoader* srv;
    
  public:
    BootLoader_srv(BootLoader* srv);
    virtual ~BootLoader_srv();
    
    Sequence& processCommand(int cmd, Sequence& params, Sequence& res);
};

#endif	// _BOOTLOADER_SRV_H
