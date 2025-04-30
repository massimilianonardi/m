#ifndef _INTERPROCESSCOMMUNICATION_H
#define	_INTERPROCESSCOMMUNICATION_H

#include "sharedmemorystream.h"
#include "sequence.h"

class InterProcessCommunication: virtual public SharedMemoryStream
{
  protected:
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
    Sequence& readparams(Sequence& params);
    Sequence& readres(Sequence& res);
    void writecmd(number cmd, Sequence& params);
    void writeres(Sequence& res);
    void waitunlock();
    void waitcmd();
    void waitres();
};

#endif	// _INTERPROCESSCOMMUNICATION_H
