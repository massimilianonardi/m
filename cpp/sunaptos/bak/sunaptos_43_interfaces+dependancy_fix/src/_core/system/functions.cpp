#include <string>
#include <sstream>

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#include <sys/time.h>
#include <unistd.h>
#else
#endif

void sleepms(long millis)
{
#ifdef WIN32
  Sleep(millis);
#elif defined LINUX
  usleep(millis*1000);
#else
#endif
}

const char* generateKey()
{
  std::stringstream key;
#ifdef WIN32
  SYSTEMTIME now;
  GetSystemTime(&now);
  key << "key_" << now.wSecond << "_" << now.wMilliseconds;
#elif defined LINUX
  struct timeval t;
  gettimeofday(&t, 0);
//  key << "key_" << t.tv_sec << "_" << t.tv_usec;
  key << t.tv_usec;
#else
#endif
  sleepms(1000);
  std::string* res = new std::string(key.str().c_str());
  return res->c_str();
}

void systemLaunch(const char* cmdline)
{
  std::string cmd = "";
#ifdef WIN32
  cmd += "start ";
#elif defined LINUX
#else
#endif
  cmd += cmdline;
#ifdef LINUX
  cmd += " &";
#else
#endif
  system(cmd.c_str());
}

const char* replace(const char* source, const char* find, const char* replace)
{
  std::string str, from, to;
  str = source;
  from = find;
  to = replace;
  size_t start_pos = 0;
  while((start_pos = str.find(from, start_pos)) != std::string::npos)
  {
    str.replace(start_pos, from.length(), to);
    start_pos += to.length();
  }
  return str.c_str();
}
