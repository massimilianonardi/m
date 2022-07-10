#ifndef _THREAD_H
#define	_THREAD_H

#include "system.h"

class Thread
{
  protected:
    bool active;
#ifdef WIN32
    HANDLE h;
#elif defined LINUX
    pthread_t h;
#else
#endif
    
  public:
    Thread();
    virtual ~Thread();

    virtual void start();
    virtual void stop();
    virtual void run();
    virtual void runloop() = 0;
};

#endif	// _THREAD_H
