#ifndef _IPCSERVER_H
#define	_IPCSERVER_H

#include "commandlistener.h"
#include "sharedmemory.h"

class IPCServer
{
  protected:
    CommandListener* cl;
    SharedMemory* sm;
    
  public:
    IPCServer(const char* key, CommandListener* cl);
    ~IPCServer();
    
    static const char* generateKey();
    void run();
};

#endif	// _IPCSERVER_H
