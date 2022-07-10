#include "ipcserver.h"
#include <windows.h>
#include <sstream>
#include <string>
//#include <sys/time.h>

#ifdef WIN32
CRITICAL_SECTION css;
#elif defined LINUX
  // todo: linux thread
#else
#endif

unsigned long threadproc(void* c)
{
  IPCServer* ipcs = static_cast<IPCServer*>(c);
  ipcs->run();
  return 0;
}

IPCServer::IPCServer(const char* key, CommandListener* cl)
{
  this->cl = cl;
#ifdef WIN32
  InitializeCriticalSection(&css);
  mmap = CreateFileMapping(INVALID_HANDLE_VALUE, 0, PAGE_READWRITE, 0, 1000000, key);
  buf = MapViewOfFile(mmap, FILE_MAP_ALL_ACCESS, 0, 0, 0);
  CreateThread(0, 0, (unsigned long (__stdcall*)(void*)) threadproc, (void*) this, 0, 0);
#elif defined LINUX
  // todo: linux thread
#else
#endif
}

IPCServer::~IPCServer()
{
#ifdef WIN32
  UnmapViewOfFile(buf);
  CloseHandle(mmap);
  DeleteCriticalSection(&css);
#elif defined LINUX
  // todo: linux code
#else
#endif
}

const char* IPCServer::generateKey()
{
  // todo: implement this method (generate keys for ipc)
//  timeval t;
//  gettimeofday(&t, 0);
  SYSTEMTIME now;
  GetSystemTime(&now);
//  srand(time(0));
//  int rnd = 0;
//  rnd = time(0);
  std::stringstream key;
//  key << "key_";
//  key << rnd;
//  key << "key_" << rand();
//  key << "key_" << clock();
//  key << "key_" << t.tv_sec << "_" << t.tv_usec;
  key << "key_" << now.wSecond << "_" << now.wMilliseconds;
  Sleep(1);
  std::string* res = new std::string(key.str().c_str());
  return res->c_str();
}

void IPCServer::run()
{
  // todo: thread function
#ifdef WIN32
  // poll
  int flag = -1;
  while(flag != 1)
  {
    memcpy(&flag, buf, sizeof(int));
  }

  // read cmd
  int cmd;
  void* src;
  src = ((byte*) buf) + sizeof(int);
  memcpy(&cmd, src, sizeof(cmd));

  // read data
  Data* data;
  src = ((byte*) src) + sizeof(cmd);
  memcpy(data, src, sizeof(data));

  // send cmd
  Data* res = cl->processCommand(cmd, data);

  // write data
  src = ((byte*) buf) + sizeof(int);
  long size = sizeof(data);
  memcpy(src, &size, size);
  src = ((byte*) src) + sizeof(size);
  memcpy(src, res, size);
  
  // write flag
  memcpy(buf, &flag, sizeof(int));
#elif defined LINUX
  // todo: linux code
#else
#endif
}
