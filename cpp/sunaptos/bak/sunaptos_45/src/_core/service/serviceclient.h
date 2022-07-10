#ifndef SERVICECLIENT_H
#define	SERVICECLIENT_H

#include "service.h"
#include "lock.h"
#include "stream.h"
#include "sequence.h"

class ServiceClient: virtual public Service, virtual public Lock
{
protected:
  Stream* s;

public:
  ServiceClient(const Sequence& params);
  ~ServiceClient();

  SERVICE_DISPATCHER_DECLARATION
  SERVICE_INTERFACES_INLINE_REROUTE
};

#endif	/* SERVICECLIENT_H */
