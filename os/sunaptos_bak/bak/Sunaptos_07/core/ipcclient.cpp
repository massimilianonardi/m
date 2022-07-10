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

Sequence& IPCClient::processCommand(int cmd, Sequence& params, Sequence& res)
{
  std::cout << "\n[IPCClient::processCommand] 00";

  lock();
  writecmd(cmd, params);

  // wait for answer
  waitres();
  res = readres(res);

  unlock();
  std::cout << "\n[IPCClient::processCommand] 01";

  return res;
}
