#ifndef _IPCCLIENT_H
#define	_IPCCLIENT_H

#include "commandlistener.h"

#include <string>
#include <iostream>
#include <fstream>
using namespace std;

class IPCClient: virtual public CommandListener
{
  protected:
    string key;
    //fstream bus;
#ifdef WIN32
    void* mmap;
    void* buf;
#elif defined LINUX
  // todo: linux code
#else
#endif

  public:
    IPCClient(const char* key);
    ~IPCClient();

    bool connect();
    virtual Data* processCommand(int cmd, Data* data);
};

#endif	// _IPCCLIENT_H
