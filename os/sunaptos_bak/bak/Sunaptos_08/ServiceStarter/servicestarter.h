#ifndef _SERVICESTARTER_H
#define _SERVICESTARTER_H

#include "object.h"
#include "sequence.h"

class ServiceStarter: virtual public Object
{
  public:
    virtual ~ServiceStarter(){};
    
    virtual Sequence& createServiceChannel(Sequence& params, Sequence& res) = 0;
};

#endif // _SERVICESTARTER_H
