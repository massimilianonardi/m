#ifndef SERVICESERVER_H
#define	SERVICESERVER_H

#include "service.h"
#include "thread.h"
#include "interprocesscommunication.h"

class ServiceServer: virtual protected InterProcessCommunication, virtual protected Thread
{
  protected:
    Service* srv;

  public:
    ServiceServer(Service* srv, Sequence& params);
    ~ServiceServer();

    static const Sequence generateKey();
    void run();
};

#endif	/* SERVICESERVER_H */
