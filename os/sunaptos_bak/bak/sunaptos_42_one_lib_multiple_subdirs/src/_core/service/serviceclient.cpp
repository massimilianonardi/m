#include "serviceclient.h"

#include "sharedmemorystream.h"
#include "exception.h"
#include "debug.h"

ServiceClient::ServiceClient(Sequence& params)
{
  s = new SharedMemoryStream((char*) params);
}

ServiceClient::~ServiceClient()
{
  delete s;
}

Sequence ServiceClient::f(const Sequence& i, const Sequence& params)
{
//  debug("ServiceClient::f " << (long)(Sequence) i << " " << (char*)(Sequence) i << " " << (char*)(Sequence) params)
  Sequence res;
  exception_try
//  waitunlock(timeoutsetting, 1); // todo: waits until timeout, then throws an exception
  waitunlock();
  lock();
  *s << i << params;

  // wait for answer
  Sequence error = 0;
  *s >> error >> res;
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
