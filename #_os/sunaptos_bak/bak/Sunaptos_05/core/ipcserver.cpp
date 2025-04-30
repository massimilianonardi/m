#include "ipcserver.h"
#include <windows.h>
#include <iostream>
#include <sstream>
#include <string>

#ifdef WIN32
CRITICAL_SECTION css;
#elif defined LINUX
  // todo: linux thread
#else
#endif

unsigned long threadproc(void* c)
{
  IPCServer* ipcs = static_cast<IPCServer*>(c);
  ipcs->run();
  return 0;
}

IPCServer::IPCServer(const char* key, CommandListener* cl)
{
  this->cl = cl;
  create(key, 1000000);
  init();
#ifdef WIN32
  InitializeCriticalSection(&css);
  CreateThread(0, 0, (unsigned long (__stdcall*)(void*)) threadproc, (void*) this, 0, 0);
#elif defined LINUX
  // todo: linux code
#else
#endif
}

IPCServer::~IPCServer()
{
  close();
#ifdef WIN32
  DeleteCriticalSection(&css);
#elif defined LINUX
  // todo: linux code
#else
#endif
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
  // todo: thread function
  std::cout << "\n[IPCServer::run] THREAD STARTED!";
  Data* res = new Data();
//  lock();
  
//  EnterCriticalSection(&css);
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
    Data* data = readparams();
    std::cout << "\n[IPCServer::run] 03";

    // process cmd
    res = cl->processCommand(cmd, data);
    std::cout << "\n[IPCServer::run] 04 res size" << res->size();

    // write result
    writeres(res);
//    std::cout << "\n[IPCServer::run] 05";

    // set flags for finished posting result
    std::cout << "\n[IPCServer::run] 06";

//     poll
//    sm->wait(false, true);
//
//    // read cmd
//    int cmd = *sm->cmd;
//
//    // read data
//    Data* data = new Data();
//    data->read(sm);
//
//    // send cmd
//    Data* res = cl->processCommand(cmd, data);
//    sm->set(true, false); // reset buffer for write, keep read flag until read data is processed
//
//    // write data
//    if(res)
//    {
//      res->write(sm);
//    }
//    else
//    {
//      // todo: write a value that will make ipcc throw an exception
//    }
//
//    sm->set(false, false);
  }

//  LeaveCriticalSection(&css);
//  unlock();
}
