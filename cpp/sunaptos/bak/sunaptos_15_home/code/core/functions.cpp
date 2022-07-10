#include "sunaptos.h"

const Sequence generateKey()
{
#ifdef WIN32
  SYSTEMTIME now;
  GetSystemTime(&now);
  std::stringstream key;
  key << "key_" << now.wSecond << "_" << now.wMilliseconds;
  Sleep(1);
  std::string* res = new std::string(key.str().c_str());
  Sequence k;
  k = res->c_str();
  return k;
#elif defined LINUX
  // todo: linux code
#else
#endif
}
