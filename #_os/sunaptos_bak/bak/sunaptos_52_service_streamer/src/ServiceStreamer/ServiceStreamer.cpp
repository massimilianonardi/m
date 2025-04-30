#include "ServiceStreamer.h"

ServiceStreamer::ServiceStreamer(SERVICE_METHOD_PARAMETERS)
{
  if(0 < params.size())
  {
    srv = params(0);
    s = new SharedMemoryStream(params, 1000000);
//    s = new SharedMemoryStream(params, 300);
    start();
  }
  else
  {
    s = new SharedMemoryStream((char*) params);
  }
}

ServiceStreamer::~ServiceStreamer()
{
  // stop runloop calls to prevent accessing to a deleted shared memory stream
//  stop();
  // unlock runloop locks
//  while(is_running());
//  delete s;
}

SERVICE_EXPORT(ServiceStreamer)

SERVICE_DISPATCHER_DEFINITION(ServiceStreamer)
{
  // TODO: ??? throw an exception if trying to stream a sequence containing pointers (Service* or void*)???
//  debug("ServiceClient::f " << (long) method_id << " " << (char*)(Sequence) method << " " << (char*)(Sequence) params)
  StreamableSequence res;
  exception_try
//  waitunlock(timeoutsetting, 1); // todo: waits until timeout, then throws an exception
  lck.waitunlock();
  lck.lock();
//  *s << StreamableSequence(method) << StreamableSequence(params);
  StreamableSequence(method).write(*s);
  StreamableSequence(params).write(*s);

  // wait for answer
  StreamableSequence error = 0;
//  *s >> error >> res;
  error.read(*s);
  res.read(*s);
  if(error)
  {
//    exception_throw_type_info(res.get(0), res.get(1))
    exception_throw
  }
  exception_catch
  exception_rethrow_end
  lck.unlock();
//  debug("ServiceClient::f 99")

  return res;
}

void ServiceStreamer::runloop()
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
