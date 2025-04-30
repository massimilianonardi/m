#include "serviceserver.h"
#include <windows.h>
#include <iostream>
#include <sstream>
#include <string>

ServiceServer::ServiceServer(Service* srv, Sequence& params)
{
  this->srv = srv;
  create(params, 1000000);
  init();
  start();
}

ServiceServer::~ServiceServer()
{
  close();
}

const Sequence ServiceServer::generateKey()
{
#ifdef WIN32
  SYSTEMTIME now;
  GetSystemTime(&now);
  std::stringstream key;
  key << "key_" << now.wSecond << "_" << now.wMilliseconds;
  Sleep(1);
  std::string* res = new std::string(key.str().c_str());
  Sequence k;
  k << res->c_str();
  return k;
#elif defined LINUX
  // todo: linux code
#else
#endif
}

void ServiceServer::run()
{
  Sequence res;

  while(true)
  {

    // wait until command posted (flags)
    waitunlock();
    waitcmd();

    // read cmd
    int cmd = readcmd();

    // read data
    Sequence params;
    params = readparams(params);

    // process cmd
    res = srv->f(cmd, params, res);

    // write result
    writeres(res);
  }
}

