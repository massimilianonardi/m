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
  debug("ServiceClient::f " << (long)(Sequence) i << " " << (char*)(Sequence) i << " " << (char*)(Sequence) params)
  Sequence res;
  exception_try
//  waitunlock(timeoutsetting, 1); // todo: waits until timeout, then throws an exception
  waitunlock();
//  debug_line
  lock();
//  debug_line
  *s << i << params;
//  debug_line

  // wait for answer
  Sequence error = 0;
//  debug_line
  *s >> error >> res;
//  debug_line
  if(error)
  {
    throw res;
  }
  exception_catch
  exception_end
  unlock();
  debug("ServiceClient::f 99")

  return res;
}
