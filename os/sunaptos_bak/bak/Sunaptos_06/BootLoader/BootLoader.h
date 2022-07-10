#ifndef _BootLoader_H
#define _BootLoader_H

#include "object.h"
#include "data.h"

class BootLoader: virtual public Object
{
  public:
    virtual ~BootLoader(){};
    
    virtual Data* boot(Data* data) = 0;
};

#endif // _BootLoader_H
