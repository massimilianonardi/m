#ifndef SERVICESERVER_H
#define	SERVICESERVER_H

#include "sequence.h"
#include "service.h"
#include "thread.h"
#include "stream.h"

class ServiceServer: virtual protected Thread
{
  protected:
    Service* srv;
    Stream* s;

  public:
    ServiceServer(Service* srv, sequence& params);
    ~ServiceServer();

    void runloop();
};

#endif	/* SERVICESERVER_H */
