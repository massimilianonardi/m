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
    // sleep until lck == false
  }
  lck = true;
}

bool Lock::trylock()
{
  if(locked())
  {
    return false;
  }
  else
  {
    lock();
    return true;
  }
}

void Lock::unlock()
{
  lck = false;
}

bool Lock::locked()
{
  return lck;
}
