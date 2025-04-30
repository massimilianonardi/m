#ifndef _IPCSERVER_H
#define	_IPCSERVER_H

#include "commandlistener.h"
#include "interprocesscommunication.h"
#include "thread.h"

class IPCServer: virtual protected InterProcessCommunication, virtual protected Thread
{
  protected:
    CommandListener* cl;
    
  public:
    IPCServer(const char* key, CommandListener* cl);
    ~IPCServer();
    
    static const char* generateKey();
    void run();
};

#endif	// _IPCSERVER_H
