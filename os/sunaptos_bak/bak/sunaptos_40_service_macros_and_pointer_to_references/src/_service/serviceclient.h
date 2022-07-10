#ifndef SERVICECLIENT_H
#define	SERVICECLIENT_H

#include "service.h"
#include "lock.h"
#include "stream.h"
#include "sequence.h"
//#include "number.h"

class ServiceClient: virtual public Service, virtual public Lock
{
  protected:
    Stream* s;
    
  public:
    ServiceClient(Sequence& params);
    ~ServiceClient();

    Sequence f(const Sequence& i, const Sequence& params);
};

#endif	/* SERVICECLIENT_H */
