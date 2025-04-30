#ifndef SERVICECLIENT_H
#define	SERVICECLIENT_H

#include "service.h"
#include "interprocesscommunication.h"

class ServiceClient: virtual public Service, virtual protected InterProcessCommunication
{
  public:
    ServiceClient(Sequence& params);
    ~ServiceClient();

    Sequence f(number i, Sequence& params);
};

#endif	/* SERVICECLIENT_H */
