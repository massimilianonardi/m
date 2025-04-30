#include "sunaptos.h"

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
  debug("ServiceClient::f 00")
  lock();
  debug("ServiceClient::f 01")
  *s << i << params;
  debug("ServiceClient::f 02")

  // wait for answer
  number error = 0;
  debug("ServiceClient::f 03")
//  *s >> error >> res;
  *s >> error;
  debug("ServiceClient::f 04")
  *s >> res;
  debug("ServiceClient::f 05")
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
