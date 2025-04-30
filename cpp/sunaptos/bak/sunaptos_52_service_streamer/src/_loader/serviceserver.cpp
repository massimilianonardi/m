#include "serviceserver.h"

#include "sharedmemorystream.h"
#include "streamablesequence.h"
#include "Exception.h"
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
  // TODO: ??? throw an exception if trying to stream a sequence containing pointers (Service* or void*)???
//  debug("ServiceServer::runloop 00")
  StreamableSequence res;
  exception_try
  StreamableSequence i = 0;
//  Sequence i;
  StreamableSequence params;
//  *s >> i >> params;
  i.read(*s);
  params.read(*s);
//  debug("" << i.text() << params.text())
  res = srv->f(i, params);
  StreamableSequence error = 0;
//  *s << error << res;
  error.write(*s);
  res.write(*s);
  exception_catch
  StreamableSequence error = 1;
//  res = Sequence();
//  res << e.t << e.text();
//  *s << error << res;
  error.write(*s);
  res.write(*s);
  exception_end
//  debug("ServiceServer::runloop 99")
}
