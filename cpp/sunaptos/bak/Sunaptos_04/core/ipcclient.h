#ifndef _IPCCLIENT_H
#define	_IPCCLIENT_H

#include "commandlistener.h"
#include "sharedmemory.h"

#include <string>
#include <iostream>
#include <fstream>
using namespace std;

class IPCClient: virtual public CommandListener
{
  protected:
    string key;
    SharedMemory* sm;

  public:
    IPCClient(const char* key);
    ~IPCClient();

    bool connect();
    virtual Data* processCommand(int cmd, Data* data);
};

#endif	// _IPCCLIENT_H
