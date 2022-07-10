#include "serviceclient.h"

ServiceClient::ServiceClient(Sequence& params)
{
  s = new SharedMemoryStream((char*) params);
}

ServiceClient::~ServiceClient()
{
  delete s;
}

Sequence ServiceClient::f(number i, Sequence& params)
{
  debug("ServiceClient::f " << (long) i << " " << (char*) params)
  Sequence res;
  try_managed
//  waitunlock(timeoutsetting, 1); // todo: waits until timeout, then throws an exception
  waitunlock();
  debug_line
  lock();
  debug_line
  *s << i << params;
  debug_line

  // wait for answer
  number error = 0;
  debug_line
  *s >> error >> res;
  debug_line
  if(error)
  {
    throw res;
  }
  catch_managed("ServiceClient::f")
  exit_try_catch_managed
  unlock();
  debug("ServiceClient::f 99")

  return res;
}
