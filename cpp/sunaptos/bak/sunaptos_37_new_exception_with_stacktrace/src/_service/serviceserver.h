#ifndef SERVICESERVER_H
#define	SERVICESERVER_H

#include "sequence.h"
#include "service.h"
#include "thread.h"
#include "stream.h"
#include "sharedmemorystream.h"
#include "exception.h"

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
