#include "sunaptos.h"

ServiceClient::ServiceClient(Sequence& params)
{
  s = new SharedMemoryStream((char*) params);
  // todo: create ipc connection towards the srv server
//  open(params);
//
//  if(pb)
//  {
//    init();
//  }
//  else
//  {
//    close();
//    throw "ipc client init failed!";
//  }
}

ServiceClient::~ServiceClient()
{
  delete s;
//    close();
}

//Sequence ServiceClient::f(number i, Sequence& params)
//{
//  Sequence res;
//  try_managed
//  lock();
//  writecmd(i, params);
//
//  // wait for answer
//  waitres();
//  res = readres(res);
//
//  unlock();
//  catch_managed("ServiceClient::f")
//  exit_try_catch_managed
//
//  return res;
//}

Sequence ServiceClient::f(number i, Sequence& params)
{
  debug("ServiceClient::f " << (long) i << " " << (char*) params)
  Sequence res;
  try_managed
//  waitunlock(timeoutsetting, 1); // todo: waits until timeout, then throws an exception
  waitunlock();
  lock();
  debug("ServiceClient::f 01")
  *s << i << params;

  // wait for answer
  number error;
  *s >> error >> res;
  debug("ServiceClient::f 02")
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
