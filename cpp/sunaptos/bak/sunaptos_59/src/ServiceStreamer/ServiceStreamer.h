#ifndef SERVICESTREAMER_H
#define	SERVICESTREAMER_H

#include "service.h"
#include "thread.h"
#include "lock.h"

// tranlslates calls/returns from/to other services into calls to read/write to a stream service
class ServiceStreamer: virtual public Service, virtual protected Thread
{
public:
  ServiceStreamer(SERVICE_METHOD_PARAMETERS);
  virtual ~ServiceStreamer();

  SERVICE_DISPATCHER_DECLARATION
  SERVICE_INTERFACES_INLINE_REROUTE
  using Service::start;
  using Thread::start;
  void runloop();
private:
  Lock lck;
  Service* srv;
  Service* stream;
};

#endif	/* SERVICESTREAMER_H */
