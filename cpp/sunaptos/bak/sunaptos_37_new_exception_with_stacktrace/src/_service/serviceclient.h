#ifndef SERVICECLIENT_H
#define	SERVICECLIENT_H

#include "sequence.h"
#include "service.h"
#include "lock.h"
#include "stream.h"
#include "sharedmemorystream.h"
#include "exception.h"

class ServiceClient: virtual public Service, virtual public Lock
{
  protected:
    Stream* s;
    
  public:
    ServiceClient(Sequence& params);
    ~ServiceClient();

    Sequence f(number i, Sequence& params);
};

#endif	/* SERVICECLIENT_H */
