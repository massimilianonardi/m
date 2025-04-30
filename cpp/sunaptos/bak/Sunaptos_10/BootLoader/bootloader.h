#ifndef _BOOTLOADER_H
#define _BOOTLOADER_H

#include "object.h"
#include "sequence.h"

class BootLoader: virtual public Object
{
  public:
    virtual ~BootLoader(){};
    
    virtual Sequence& boot(Sequence& params, Sequence& res) = 0;
};

#endif // _BOOTLOADER_H
