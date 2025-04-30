#ifndef _BootLoaderServer2_H
#define	_BootLoaderServer2_H

#include "BootLoader.h"
#include "loader.h"

class BootLoaderServer2: virtual public BootLoader
{
  public:
    BootLoaderServer2(Loader* loader);
    virtual ~BootLoaderServer2();
    
    Data* boot(Data* data);
};

#endif	// _BootLoaderServer2_H
