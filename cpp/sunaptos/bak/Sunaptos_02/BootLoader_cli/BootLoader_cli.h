#ifndef _BootLoader_cli_H
#define	_BootLoader_cli_H

#include "BootLoader.h"
#include "commandlistener.h"

class BootLoader_cli: virtual public BootLoader
{
  private:
    CommandListener* cl;
    
  public:
    BootLoader_cli(CommandListener* cl);
    virtual ~BootLoader_cli();
    
    Data* boot(Data* data);
};

#endif	// _BootLoader_cli_H
