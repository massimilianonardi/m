#include "ipcserver.h"
#include <windows.h>
#include <iostream>
#include <sstream>
#include <string>

IPCServer::IPCServer(const char* key, CommandListener* cl)
{
  this->cl = cl;
  create(key, 1000000);
  init();
  start();
}

IPCServer::~IPCServer()
{
  close();
}

const char* IPCServer::generateKey()
{
#ifdef WIN32
  SYSTEMTIME now;
  GetSystemTime(&now);
  std::stringstream key;
  key << "key_" << now.wSecond << "_" << now.wMilliseconds;
  Sleep(1);
  std::string* res = new std::string(key.str().c_str());
  return res->c_str();
#elif defined LINUX
  // todo: linux code
#else
#endif
}

void IPCServer::run()
{
  std::cout << "\n[IPCServer::run] THREAD STARTED!";
  Sequence res;

  while(true)
  {
    std::cout << "\n[IPCServer::run] 00";

    // wait until command posted (flags)
    waitunlock();
    waitcmd();

    // read cmd
    int cmd = readcmd();
    std::cout << "\n[IPCServer::run] 02 cmd = " << cmd;

    // read data
    Sequence params;
    params = readparams(params);
    std::cout << "\n[IPCServer::run] 03";

    // process cmd
    res = cl->processCommand(cmd, params, res);
    std::cout << "\n[IPCServer::run] 04 res size" << res.size();

    // write result
    writeres(res);
    std::cout << "\n[IPCServer::run] 05";
  }
}
