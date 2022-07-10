#ifndef _servicestarter_H
#define _servicestarter_H

#include "object.h"
#include "data.h"

class ServiceStarter: virtual public Object
{
  public:
    virtual ~ServiceStarter(){};
    
    virtual Data* createServiceChannel(Data* data) = 0;
};

#endif // _servicestarter_H
