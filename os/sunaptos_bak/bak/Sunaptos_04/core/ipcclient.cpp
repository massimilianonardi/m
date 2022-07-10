
#include "datavector.h"

#include "ipcclient.h"
#include "sharedmemory.h"
#include <windows.h>

#ifdef WIN32
CRITICAL_SECTION cs;
#elif defined LINUX
  // todo: linux code
#else
#endif

IPCClient::IPCClient(const char* key)
{
  this->key = key;
  sm = new SharedMemory();
#ifdef WIN32
  InitializeCriticalSection(&cs);
#elif defined LINUX
  // todo: linux code
#else
#endif
}

IPCClient::~IPCClient()
{
#ifdef WIN32
  sm->close();
  DeleteCriticalSection(&cs);
#elif defined LINUX
  // todo: linux code
#else
#endif
}

bool IPCClient::connect()
{
  sm->open(key.c_str());

  return true;
}

Data* IPCClient::processCommand(int cmd, Data* data)
{
  std::cout << "\n[IPCClient::processCommand] 00 cmd = " << cmd;
//  Sleep(5000);
#ifdef WIN32
  if(data)
  {
    EnterCriticalSection(&cs);

    std::cout << "\n[IPCClient::processCommand] 01";
    // init
    sm->set(false, false);

    std::cout << "\n[IPCClient::processCommand] 02";
    // send
    *sm->cmd = cmd;
    data->write(sm);

    std::cout << "\n[IPCClient::processCommand] 03";;
    // wait for answer
    sm->wait(false, false);

    std::cout << "\n[IPCClient::processCommand] 04";
    // read result
    Data* res = new Data();
    res->read(sm);

    std::cout << "\n[IPCClient::processCommand] 05";
    // clear
    sm->set(false, false);

    std::cout << "\n[IPCClient::processCommand] 06";
    LeaveCriticalSection(&cs);

    std::cout << "\n[IPCClient::processCommand] 07";
    return res;
  }
  else
  {
    // todo: error
    throw "data pointer null";
    //return 0;
  }
#elif defined LINUX
  // todo: linux thread
#else
#endif
}
