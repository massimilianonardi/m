#ifndef _BOOTLOADER_CLI_H
#define	_BOOTLOADER_CLI_H

#include "bootloader.h"
#include "commandlistener.h"

class BootLoader_cli: virtual public BootLoader
{
  private:
    CommandListener* cl;
    
  public:
    BootLoader_cli(CommandListener* cl);
    virtual ~BootLoader_cli();
    
    Sequence& boot(Sequence& params, Sequence& res);
};

#endif	// _BOOTLOADER_CLI_H
