#include "sunaptos.h"

ServiceServer::ServiceServer(Service* srv, sequence& params): srv(srv)
{
  s = new SharedMemoryStream(params, 1000000);
//  s = new SharedMemoryStream(params, 300);
  start();
}

ServiceServer::~ServiceServer()
{
  delete s;
}

void ServiceServer::runloop()
{
  sequence res;
  res = sequence("");
  try_managed
  sequence i = 0;
  sequence params;
  params = sequence("");
  *s >> i >> params;
  debug("ServiceServer::runloop 03")
  res = srv->f(&i, &params);
  debug("ServiceServer::runloop 04 " << (long) i << " " << (char*) params << " " << (long) res << "-")
  sequence error = false;
  debug("ServiceServer::runloop 05")
  *s << error << res;
  catch_managed("ServiceServer::runloop")
//  *s << (number) 1 << res;
  sequence error = true;
  *s << error << res;
  exit_try_catch_managed
  debug("ServiceServer::runloop 99")
}
