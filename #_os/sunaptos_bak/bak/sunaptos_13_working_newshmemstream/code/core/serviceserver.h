#ifndef SERVICESERVER_H
#define	SERVICESERVER_H

#include "thread.h"
//#include "interprocesscommunication.h"

class ServiceServer: virtual protected Thread//, virtual protected InterProcessCommunication
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
