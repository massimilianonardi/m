#ifndef SERVICECLIENT_H
#define	SERVICECLIENT_H

#include "sequence.h"
#include "service.h"
#include "lock.h"
#include "stream.h"

class ServiceClient: virtual public Service, virtual public Lock
{
  protected:
    Stream* s;
    
  public:
    ServiceClient(sequence& params);
    ~ServiceClient();

    sequence f(sequence& i, sequence& params);
};

#endif	/* SERVICECLIENT_H */
