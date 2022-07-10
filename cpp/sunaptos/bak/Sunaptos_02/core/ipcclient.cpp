#include "ipcclient.h"
#include <windows.h>

#ifdef WIN32
CRITICAL_SECTION cs;
#elif defined LINUX
  // todo: linux thread
#else
#endif

IPCClient::IPCClient(const char* key)
{
  this->key = key;
#ifdef WIN32
  InitializeCriticalSection(&cs);
#elif defined LINUX
  // todo: connect to memory mapping
#else
#endif
}

IPCClient::~IPCClient()
{
  //bus.close();
#ifdef WIN32
  UnmapViewOfFile(buf);
  CloseHandle(mmap);
  DeleteCriticalSection(&cs);
#elif defined LINUX
  // todo: linux code
#else
#endif
}

bool IPCClient::connect()
{
#ifdef WIN32
  mmap = OpenFileMapping(FILE_MAP_ALL_ACCESS, false, key.c_str());
  buf = MapViewOfFile(mmap, FILE_MAP_ALL_ACCESS, 0, 0, 0);
#elif defined LINUX
  // todo: connect to memory mapping
#else
#endif
  
  return false;
}

Data* IPCClient::processCommand(int cmd, Data* data)
{
#ifdef WIN32
  EnterCriticalSection(&cs);
  // send
  int flag = 1;
  void* dest;
  dest = ((byte*) buf) + sizeof(int);
  memcpy(dest, &cmd, sizeof(cmd));
  dest = ((byte*) dest) + sizeof(cmd);
  memcpy(dest, data, sizeof(data));
  memcpy(buf, &flag, sizeof(int));

  // poll for result (flag == -1)
  while(flag != -1)
  {
    memcpy(&flag, buf, sizeof(int));
  }

  // read result
  Data* res;
  dest = ((byte*) buf) + sizeof(int);
  long size;
  memcpy(&size, dest, sizeof(long));
  res = (Data*) malloc(size);
  dest = ((byte*) dest) + sizeof(size);
  memcpy(res, dest, size);

  // reset flag = 0
  flag = 0;
  memcpy(buf, &flag, sizeof(int));
  LeaveCriticalSection(&cs);
#elif defined LINUX
  // todo: linux thread
#else
#endif

  return 0;
}
