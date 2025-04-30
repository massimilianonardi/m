#include "sunaptos.h"

ServiceServer::ServiceServer(Service* srv, Sequence& params): srv(srv)
{
  s = new SharedMemoryStream(params, 1000000);
//  create(params, 1000000);
//  init();
  start();
}

ServiceServer::~ServiceServer()
{
  delete s;
//  close();
}

//void ServiceServer::runloop()
//{
//  Sequence res;
//
//  try_managed
//  // wait until command posted (flags)
//  waitunlock();
//  waitcmd();
//
//  // read cmd
//  int cmd = readcmd();
//
//  // read data
//  Sequence params;
//  params = readparams(params);
//
//  // process cmd
//  res = srv->f(cmd, params);
//
//  // write result
//  writeres(res);
//  catch_managed("ServiceServer::runloop")
//  exit_try_catch_managed
//}

void ServiceServer::runloop()
{
  debug("ServiceServer::runloop 00")
  Sequence res;
  try_managed
  number i = 0;
  Sequence params;

  *s >> i >> params;
//  *s >> i;
//  debug("ServiceServer::runloop 01 " << (long) i)
//  *s >> params;
//  debug("ServiceServer::runloop 02 " << (long) i << (char*) params)
  res = srv->f(i, params);
  *s << (number) 0 << res;
  catch_managed("ServiceServer::runloop")
  *s << (number) 1 << res;
  exit_try_catch_managed
  debug("ServiceServer::runloop 99")
}
