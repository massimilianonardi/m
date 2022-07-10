#include "sharedmemory.h"

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#include <sys/ipc.h>
#include <sys/shm.h>
#else
#endif

SharedMemory::SharedMemory()
{
}

SharedMemory::SharedMemory(const char* key, long size)
{
  create(key, size);
}

SharedMemory::SharedMemory(const char* key)
{
  open(key);
}

SharedMemory::~SharedMemory()
{
  close();
}

bool SharedMemory::create(const char* key, long size)
{
#ifdef WIN32
  mmap = CreateFileMapping(INVALID_HANDLE_VALUE, 0, PAGE_READWRITE, 0, size, key);
  pb = MapViewOfFile(mmap, FILE_MAP_ALL_ACCESS, 0, 0, 0);
#elif defined LINUX
  mmap = shmget((key_t) atoi(key), size, IPC_CREAT | IPC_EXCL | 00777);
  pb = shmat(mmap, 0, 0);
#else
#endif
  setPointers();
  if(pb)
  {
    *psz = size;
    return true;
  }
  else
  {
    throw "\n[SharedMemory::create] FAILED!!! pb = ";
    return false;
  }
}

bool SharedMemory::open(const char* key)
{
#ifdef WIN32
  mmap = OpenFileMapping(FILE_MAP_ALL_ACCESS, false, key);
  pb = MapViewOfFile(mmap, FILE_MAP_ALL_ACCESS, 0, 0, 0);
#elif defined LINUX
  mmap = shmget((key_t) atoi(key), 1000000, 0);
  pb = shmat(mmap, 0, 0);
#else
#endif
  setPointers();
  if(pb)
  {
    return true;
  }
  else
  {
    throw "\n[SharedMemory::open] FAILED!!! pb = ";
    return false;
  }
}

void SharedMemory::close()
{
#ifdef WIN32
  UnmapViewOfFile(pb);
  CloseHandle(mmap);
#elif defined LINUX
  // todo: linux code
#else
#endif
}

long SharedMemory::size()
{
  return *psz;
}

const void* SharedMemory::get()
{
  return (const void*) pdata;
}

void SharedMemory::setPointers()
{
  if(pb)
  {
    psz = (long*) pb;
    pdata = psz + sizeof(long);
  }
}
