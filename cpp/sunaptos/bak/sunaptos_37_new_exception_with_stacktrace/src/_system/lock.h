#ifndef _LOCK_H
#define	_LOCK_H

#include "functions.h"

class Lock
{
  protected:
    bool lck;

  public:
    Lock();
    virtual ~Lock();

    void lock();
    void lock(long millis);
    bool trylock();
    void unlock();
    void waitunlock();
    void waitunlock(long millis);
    bool locked();
};

#endif	// _LOCK_H
