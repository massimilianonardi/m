#include "ipcserver.h"
#include "sharedmemory.h"
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
  sm = new SharedMemory();
  sm->create(key, 1000000);
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
  sm->close();
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
#ifdef WIN32
  EnterCriticalSection(&css);
  
  while(true)
  {
    // poll
    std::cout << "\n[IPCServer::run] 01";
    sm->wait(false, true);

    std::cout << "\n[IPCServer::run] 02";
    // read cmd
    int cmd = *sm->cmd;

    std::cout << "\n[IPCServer::run] 03";
    // read data
    Data* data = new Data();
    data->read(sm);

    std::cout << "\n[IPCServer::run] 04";
    std::cout << "\n[IPCServer::run] 04 cmd = " << cmd;
    std::cout << "\n[IPCServer::run] 04 data nelems = " << data->size();
    // send cmd
    Data* res = cl->processCommand(cmd, data);
    sm->set(true, false); // reset buffer for write, keep read flag until read data is processed

    std::cout << "\n[IPCServer::run] 05";
    // write data
    if(res)
    {
      res->write(sm);
      std::cout << "\n[IPCServer::run] 06";
    }
    else
    {
      // todo: write a value that will make ipcc throw an exception
    }
    
    sm->set(false, false);
  }

  LeaveCriticalSection(&css);
#elif defined LINUX
  // todo: linux code
#else
#endif
}
