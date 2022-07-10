#ifndef _IPCSERVER_H
#define	_IPCSERVER_H

#include "commandlistener.h"

class IPCServer
{
  protected:
    CommandListener* cl;
#ifdef WIN32
    void* mmap;
    void* buf;
#elif defined LINUX
  // todo: linux code
#else
#endif
    
  public:
    IPCServer(const char* key, CommandListener* cl);
    ~IPCServer();
    
    static const char* generateKey();
    void run();
};

#endif	// _IPCSERVER_H
