#include "sunaptos.h"

void sleepms(long millis)
{
#ifdef WIN32
  Sleep(millis);
#elif defined LINUX
  usleep(millis*1000);
#else
#endif
}

sequence generateKey()
{
#ifdef WIN32
  SYSTEMTIME now;
  GetSystemTime(&now);
  std::stringstream key;
  key << "key_" << now.wSecond << "_" << now.wMilliseconds;
#elif defined LINUX
  struct timeval t;
  gettimeofday(&t, 0);
  std::stringstream key;
//  key << "key_" << t.tv_sec << "_" << t.tv_usec;
  key << t.tv_usec;
#else
#endif
  sleepms(1000);
  std::string* res = new std::string(key.str().c_str());
  sequence k;
  k = sequence(res->c_str());
  return k;
}
