#ifndef _INTERPROCESSCOMMUNICATION_H
#define	_INTERPROCESSCOMMUNICATION_H

#include "sharedmemorystream.h"
#include "data.h"

#include <string>
using namespace std;

class InterProcessCommunication: virtual public SharedMemoryStream
{
  protected:
//    bool* cmdposted;
//    bool* ansposted;
//    int* cmd;
//    char* params;
//    char* res;
    long nlocked;
    long ncmdposted;
    long nansposted;
    long ncmd;
    long nparams;
    long nres;

  public:
    InterProcessCommunication();
    virtual ~InterProcessCommunication();

    void init();
    void lock();
    void unlock();
    int readcmd();
    Data* readparams();
    Data* readres();
    void writecmd(int cmd, Data* params);
    void writeres(Data* res);
    void waitunlock();
    void waitcmd();
    void waitres();
};

#endif	// _INTERPROCESSCOMMUNICATION_H
