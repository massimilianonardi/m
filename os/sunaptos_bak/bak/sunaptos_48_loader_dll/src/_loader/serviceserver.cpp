#include "serviceserver.h"

#include "sharedmemorystream.h"
#include "exception.h"
#include "debug.h"

ServiceServer::ServiceServer(Service& srv, Sequence& params): srv(&srv)
{
  s = new SharedMemoryStream(params, 1000000);
//  s = new SharedMemoryStream(params, 300);
  start();
}

ServiceServer::~ServiceServer()
{
  // stop runloop calls to prevent accessing to a deleted shared memory stream
//  stop();
  // unlock runloop locks
//  while(is_running());
//  delete s;
}

void ServiceServer::runloop()
{
//  debug("ServiceServer::runloop 00")
  Sequence res;
  exception_try
  Sequence i = 0;
//  Sequence i;
  Sequence params;
  *s >> i >> params;
//  debug("" << i.text() << params.text())
  res = srv->f(i, params);
  Sequence error = 0;
  *s << error << res;
  exception_catch
  Sequence error = 1;
//  res = Sequence();
//  res << e.t << e.text();
  *s << error << res;
  exception_end
//  debug("ServiceServer::runloop 99")
}
