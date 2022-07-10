#ifndef _IPCCLIENT_H
#define	_IPCCLIENT_H

#include "commandlistener.h"
#include "interprocesscommunication.h"

class IPCClient: virtual protected InterProcessCommunication, virtual public CommandListener
{
  protected:
    string key;
    bool connected;

  public:
    IPCClient(const char* key);
    ~IPCClient();

    bool connect();
    Sequence& processCommand(int cmd, Sequence& params, Sequence& res);
};

#endif	// _IPCCLIENT_H
