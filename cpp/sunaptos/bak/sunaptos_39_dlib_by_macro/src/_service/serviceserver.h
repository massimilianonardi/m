#ifndef SERVICESERVER_H
#define	SERVICESERVER_H

#include "thread.h"
#include "service.h"
#include "stream.h"
#include "sequence.h"

class ServiceServer: virtual protected Thread
{
  protected:
    Service* srv;
    Stream* s;

  public:
    ServiceServer(Service* srv, Sequence& params);
    ~ServiceServer();

    void runloop();
};

#endif	/* SERVICESERVER_H */
