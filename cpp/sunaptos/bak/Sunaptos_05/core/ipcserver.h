#ifndef _IPCSERVER_H
#define	_IPCSERVER_H

#include "commandlistener.h"
#include "interprocesscommunication.h"
#include "sharedmemorystream.h"
#include "lock.h"

class IPCServer: virtual protected InterProcessCommunication
{
  protected:
    CommandListener* cl;
//    SharedMemory* sm;
    
  public:
    IPCServer(const char* key, CommandListener* cl);
    ~IPCServer();
    
    static const char* generateKey();
    void run();
};

#endif	// _IPCSERVER_H
