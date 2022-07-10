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

void Lock::unlock()
{
  lck = false;
}

bool Lock::locked()
{
  return lck;
}
