#ifndef _IPCCLIENT_H
#define	_IPCCLIENT_H

#include "commandlistener.h"
#include "interprocesscommunication.h"
#include "sharedmemorystream.h"
#include "lock.h"

#include <string>
using namespace std;

class IPCClient: virtual protected InterProcessCommunication, virtual public CommandListener
{
  protected:
    string key;
    bool connected;

  public:
    IPCClient(const char* key);
    ~IPCClient();

    bool connect();
    Data* processCommand(int cmd, Data* data);
};

#endif	// _IPCCLIENT_H
