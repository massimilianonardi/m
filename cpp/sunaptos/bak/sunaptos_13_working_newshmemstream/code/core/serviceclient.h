#ifndef SERVICECLIENT_H
#define	SERVICECLIENT_H

#include "service.h"
#include "lock.h"
#include "stream.h"
//#include "interprocesscommunication.h"

class ServiceClient: virtual public Service, virtual public Lock//, virtual protected InterProcessCommunication
{
  protected:
    Stream* s;
    
  public:
    ServiceClient(Sequence& params);
    ~ServiceClient();

    Sequence f(number i, Sequence& params);
};

#endif	/* SERVICECLIENT_H */
