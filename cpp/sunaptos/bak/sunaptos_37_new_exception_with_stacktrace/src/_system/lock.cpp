#include "lock.h"

Lock::Lock()
{
  lck = false;
}

Lock::~Lock()
{
}

void Lock::lock()
{
  while(lck)
  {
    // sleep until lck == false...waiting to get ownership because someone else is using it! NB must be synchronized!!!
    sleepms(1000);
  }
  lck = true;
}

void Lock::lock(long millis)
{
  // todo: try to get ownership for a maximum of time
  lock(); // todo: replace with a proper implementation!
}

bool Lock::trylock()
{
  if(locked())
  {
    return false;
  }
  else
  {
    lock(); // todo: safe implementation to ensure no one else gets first
    return true;
  }
}

void Lock::unlock()
{
  lck = false;
}

void Lock::waitunlock()
{
  while(lck)
  {
    // sleep until lck == false...waiting to get ownership because someone else is using it! NB must be synchronized!!!
    sleepms(1000);
  }
}

void Lock::waitunlock(long millis)
{
  // todo: try to get ownership for a maximum of time
  waitunlock(); // todo: replace with a proper implementation!
}

bool Lock::locked()
{
  return lck;
}
