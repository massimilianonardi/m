#include "serviceclient.h"

#include "sharedmemorystream.h"
#include "streamablesequence.h"
#include "Exception.h"
#include "debug.h"

ServiceClient::ServiceClient(const Sequence& params)
{
  s = new SharedMemoryStream((char*) params);
}

ServiceClient::~ServiceClient()
{
  delete s;
}

SERVICE_DISPATCHER_DEFINITION(ServiceClient)
{
  // TODO: ??? throw an exception if trying to stream a sequence containing pointers (Service* or void*)???
//  debug("ServiceClient::f " << (long) method_id << " " << (char*)(Sequence) method << " " << (char*)(Sequence) params)
  StreamableSequence res;
  exception_try
//  waitunlock(timeoutsetting, 1); // todo: waits until timeout, then throws an exception
  waitunlock();
  lock();
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
  unlock();
//  debug("ServiceClient::f 99")

  return res;
}
