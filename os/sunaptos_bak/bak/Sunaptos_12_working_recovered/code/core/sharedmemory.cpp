#include "sharedmemory.h"
#include <string.h>
#include <iostream>

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
  // todo: linux code
#else
#endif

SharedMemory::SharedMemory()
{
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
  // todo: linux code
#else
#endif
  setPointers();
  *psz = size;
//  std::cout << "\n[SharedMemory::create] pb = " << pb;
//  std::cout << "\n[SharedMemory::create] psz = " << psz;
//  std::cout << "\n[SharedMemory::create] size = " << *psz;
//  std::cout << "\n[SharedMemory::create] pdata = " << pdata;
  if(pb)
  {
    return true;
  }
  else
  {
    std::cout << "\n[SharedMemory::create] FAILED!!! pb = " << pb;
    return false;
  }
}

bool SharedMemory::open(const char* key)
{
#ifdef WIN32
  mmap = OpenFileMapping(FILE_MAP_ALL_ACCESS, false, key);
  pb = MapViewOfFile(mmap, FILE_MAP_ALL_ACCESS, 0, 0, 0);
#elif defined LINUX
  // todo: linux code
#else
#endif
  setPointers();
  if(pb)
  {
//    std::cout << "\n[SharedMemory::open] pb = " << pb;
//    std::cout << "\n[SharedMemory::open] psz = " << psz;
//    std::cout << "\n[SharedMemory::open] size = " << *psz;
//    std::cout << "\n[SharedMemory::open] pdata = " << pdata;
    return true;
  }
  else
  {
    std::cout << "\n[SharedMemory::open] FAILED!!! pb = " << pb;
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
