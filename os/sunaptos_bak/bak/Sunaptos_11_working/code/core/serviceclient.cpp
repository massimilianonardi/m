#include "serviceclient.h"

ServiceClient::ServiceClient(Sequence& params)
{
  // todo: create ipc connection towards the srv server
  open(params);

  if(pb)
  {
    init();
  }
  else
  {
    close();
    throw "ipc client init failed!";
  }
}

ServiceClient::~ServiceClient()
{
    close();
}

Sequence ServiceClient::f(number i, Sequence& params)
{
  Sequence res;
  lock();
  writecmd(i, params);

  // wait for answer
  waitres();
  res = readres(res);

  unlock();

  return res;
}
