#include "sunaptos.h"

const Sequence generateKey()
{
#ifdef WIN32
  SYSTEMTIME now;
  GetSystemTime(&now);
  std::stringstream key;
  key << "key_" << now.wSecond << "_" << now.wMilliseconds;
  Sleep(1);
#elif defined LINUX
  struct timeval t;
  gettimeofday(&t, 0);
  std::stringstream key;
//  key << "key_" << t.tv_sec << "_" << t.tv_usec;
  key << t.tv_usec;
  usleep(1000);
#else
#endif
  std::string* res = new std::string(key.str().c_str());
  Sequence k;
  k = res->c_str();
  return k;
}
