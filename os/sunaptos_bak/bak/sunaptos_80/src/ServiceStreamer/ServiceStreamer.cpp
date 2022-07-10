#include "ServiceStreamer.h"

#include "sharedmemorystream.h"

ServiceStreamer::ServiceStreamer(SERVICE_METHOD_PARAMETERS)
{
//  stream = params;
  if(0 < params.size())
  {
    srv = params(0);
    stream = new SharedMemoryStream(params, 1000000);
//    stream = new SharedMemoryStream(params, 300);
    start();
  }
  else
  {
    stream = new SharedMemoryStream((char*) params);
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
//  debug("ServiceClient::f " << (long) method << " " << (char*)(Sequence) method << " " << (char*)(Sequence) params)
  Sequence res;
  exception_try
//  waitunlock(timeoutsetting, 1); // todo: waits until timeout, then throws an exception
  lck.waitunlock();
  lck.lock();
//  *s << StreamableSequence(method) << StreamableSequence(params);
  
  stream->write(method);
  stream->write(params);

  // wait for answer
  Sequence error = 0;
//  *s >> error >> res;
  error = stream->read(0);
  res = stream->read(0);
  if((int) error)
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
  Sequence res;
  exception_try
  Sequence i = 0;
//  Sequence i;
  Sequence params;
//  *s >> i >> params;
  i = stream->read(0);
  params = stream->read(0);
  debug("" << i.to_string() << params.to_string())
  res = srv->f(i, params);
  Sequence error = 0;
//  *s << error << res;
  stream->write(error);
  stream->write(res);
  exception_catch
  Sequence error = 1;
//  res = Sequence();
//  res << e.t << e.text();
//  *s << error << res;
  stream->write(error);
  stream->write(res);
  exception_end
//  debug("ServiceServer::runloop 99")
}
