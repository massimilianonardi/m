#include "ipcclient.h"
#include <windows.h>
#include <iostream>

#ifdef WIN32
CRITICAL_SECTION cs;
#elif defined LINUX
  // todo: linux code
#else
#endif

IPCClient::IPCClient(const char* key)
{
  this->key = key;
  connected = false;
#ifdef WIN32
  InitializeCriticalSection(&cs);
#elif defined LINUX
  // todo: linux code
#else
#endif
}

IPCClient::~IPCClient()
{
  close();
#ifdef WIN32
  DeleteCriticalSection(&cs);
#elif defined LINUX
  // todo: linux code
#else
#endif
}

bool IPCClient::connect()
{
  open(key.c_str());
  connected = true;
  init();

  return true;
}

Data* IPCClient::processCommand(int cmd, Data* data)
{
  Data* res;
//  lock();

  if(data)
  {
    EnterCriticalSection(&cs);
    std::cout << "\n[IPCClient::processCommand] 00";

    // clear flags
//    init();
//    std::cout << "\n[IPCClient::processCommand] 01";

    lock();
    // write cmd
    // write data
    writecmd(cmd, data);
//    std::cout << "\n[IPCClient::processCommand] 02";

    // set flags for finished posting cmd
//    std::cout << "\n[IPCClient::processCommand] 03";

    // wait for answer
    waitres();
//    std::cout << "\n[IPCClient::processCommand] 04";

    // read result
    res = readres();

    unlock();
    std::cout << "\n[IPCClient::processCommand] 05";

    // clear flags
    // unnecessary...
    LeaveCriticalSection(&cs);

//    EnterCriticalSection(&cs);
//
//    // init
//    sm->set(false, false);
//
//    // send
//    *sm->cmd = cmd;
//    data->write(sm);
//
//    // wait for answer
//    sm->wait(false, false);
//
//    // read result
//    Data* res = new Data();
//    res->read(sm);
//
//    // clear
//    sm->set(false, false);
//
//    LeaveCriticalSection(&cs);
//
//    return res;
  }
  else
  {
    // todo: error
    throw "data pointer null";
    //return 0;
  }

//  unlock();

  return res;
}
