#include "serviceserver.h"

#include "sharedmemorystream.h"
#include "exception.h"
#include "debug.h"

ServiceServer::ServiceServer(Service* srv, Sequence& params): srv(srv)
{
  s = new SharedMemoryStream(params, 1000000);
//  s = new SharedMemoryStream(params, 300);
  start();
}

ServiceServer::~ServiceServer()
{
  delete s;
}

void ServiceServer::runloop()
{
  debug("ServiceServer::runloop 00")
  Sequence res;
  exception_try
  number i = 0;
  Sequence params;
  *s >> i >> params;
//  debug("ServiceServer::runloop 01 srv=" << (long) srv << " i=" << i << " params=" << params.text() << "\n")
  debug("ServiceServer::runloop 01 srv=" << (long) srv << " i=" << i << " params=" << (char*) params << "\n")
  res = srv->f(i, params);
//  srv->f(i, params);
  debug("ServiceServer::runloop 02 " << res.text())
  *s << (number) 0 << res;
  exception_catch
  *s << (number) 1 << res;
  exception_end
  debug("ServiceServer::runloop 99")
}
