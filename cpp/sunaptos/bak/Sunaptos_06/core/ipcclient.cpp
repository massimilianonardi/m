#include "ipcclient.h"
#include <windows.h>
#include <iostream>

IPCClient::IPCClient(const char* key)
{
  this->key = key;
  connected = false;
}

IPCClient::~IPCClient()
{
  close();
}

bool IPCClient::connect()
{
  open(key.c_str());
  
  if(pb)
  {
    connected = true;
    init();
  }
  else
  {
    connected = false;
    close();
  }

  return connected;
}

Data* IPCClient::processCommand(int cmd, Data* data)
{
  Data* res;

  if(data)
  {
    std::cout << "\n[IPCClient::processCommand] 00";

    lock();
    writecmd(cmd, data);

    // wait for answer
    waitres();
    res = readres();

    unlock();
    std::cout << "\n[IPCClient::processCommand] 01";
  }
  else
  {
    // todo: error
    throw "data pointer null";
    //return 0;
  }

  return res;
}
