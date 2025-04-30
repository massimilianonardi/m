#include "sunaptos.h"

ServiceClient::ServiceClient(sequence& params)
{
  s = new SharedMemoryStream((char*) params);
}

ServiceClient::~ServiceClient()
{
  delete s;
}

sequence ServiceClient::f(element i, sequence& params)
{
//  debug("ServiceClient::f " << i.lu << " " << (char*) params)
  sequence res;
  try_managed
//  waitunlock(timeoutsetting, 1); // todo: waits until timeout, then throws an exception
  waitunlock();
  lock();
  *s << i << params;

  // wait for answer
  element error = false;
  debug("ServiceClient::f 04")
  *s >> error >> res;
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
