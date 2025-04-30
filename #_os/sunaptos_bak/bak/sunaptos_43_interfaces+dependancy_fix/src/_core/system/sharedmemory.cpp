#include "sharedmemory.h"

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#include <sys/ipc.h>
#include <sys/shm.h>
#else
#endif

#include "exception.h"

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
  if(mmap == 0) exception_throw_type(Exception::creation_failed)
  
  pb = MapViewOfFile(mmap, FILE_MAP_ALL_ACCESS, 0, 0, 0);
  if(pb == 0) exception_throw_type(Exception::creation_failed)
#elif defined LINUX
  mmap = shmget((key_t) atoi(key), size, IPC_CREAT | IPC_EXCL | 00777);
  if(mmap == -1) exception_throw_type(Exception::creation_failed)
  
  pb = shmat(mmap, 0, 0);
  if(pb == -1) exception_throw_type(Exception::creation_failed)
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
  if(mmap == 0) exception_throw_type(Exception::open_failed)
  
  pb = MapViewOfFile(mmap, FILE_MAP_ALL_ACCESS, 0, 0, 0);
  if(pb == 0) exception_throw_type(Exception::open_failed)
#elif defined LINUX
  mmap = shmget((key_t) atoi(key), 1000000, 0);
  if(mmap == -1) exception_throw_type(Exception::open_failed)
  
  pb = shmat(mmap, 0, 0);
  if(pb == -1) exception_throw_type(Exception::open_failed)
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
  shmdt(pb);
  shmctl(mmap, IPC_RMID, );
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
