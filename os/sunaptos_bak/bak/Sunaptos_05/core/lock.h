#ifndef _LOCK_H
#define	_LOCK_H

class Lock
{
  protected:
    bool lck;

  public:
    Lock();
    virtual ~Lock();

    void lock();
    void unlock();
    bool locked();
};

#endif	// _LOCK_H
