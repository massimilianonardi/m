#include "sharedmemory.h"
#include "buffer.h"
#include <iostream>

SharedMemory::SharedMemory()
{
}

SharedMemory::~SharedMemory()
{
  close();
}

void SharedMemory::read(Buffer* buffer)
{
//  std::cout << "\nSharedMemory::read size " << buffer->size() << " n " << *(long*) buffer->get() << " char " << (char*) buffer->get();
  buffer->set((char*) data + posr, buffer->size());
  posr += buffer->size();
  *r = true;
//  std::cout << "\nSharedMemory::read OK " << posr;
}

void SharedMemory::write(Buffer* buffer)
{
  std::cout << "\nSharedMemory::write size " << buffer->size() << " n " << *(long*) buffer->get() << " char " << (char*) buffer->get();
  memcpy((char*) data + posw, buffer->get(), buffer->size());
  posw += buffer->size();
  *w = true;
  std::cout << "\nSharedMemory::write OK " << posw;
}

void SharedMemory::create(const char* key, long size)
{
#ifdef WIN32
  mmap = CreateFileMapping(INVALID_HANDLE_VALUE, 0, PAGE_READWRITE, 0, size, key);
  buf = MapViewOfFile(mmap, FILE_MAP_ALL_ACCESS, 0, 0, 0);
#elif defined LINUX
  // todo: linux code
#else
#endif
  s = size;
  setpointers();
}

void SharedMemory::open(const char* key)
{
#ifdef WIN32
  mmap = OpenFileMapping(FILE_MAP_ALL_ACCESS, false, key);
  buf = MapViewOfFile(mmap, FILE_MAP_ALL_ACCESS, 0, 0, 0);
//  MEMORY_BASIC_INFORMATION mbi;
//  s = VirtualQuery(buf, &mbi, 0);
//  std::cout << "\nSharedMemory::open size1 = " << s;
//  s = mbi.RegionSize;
//  std::cout << "\nSharedMemory::open size2 = " << s;
#elif defined LINUX
  // todo: linux code
#else
#endif
  s = 900000; // find a way to get the correct size of the buffer
  setpointers();
}

long SharedMemory::size()
{
  return s;
}

void SharedMemory::set(bool read, bool write)
{
  *r = read;
  *w = write;

  if(!read)
  {
    posr = 0;
  }

  if(!write)
  {
    posw = 0;
  }
}

void SharedMemory::wait(bool read, bool write)
{
//  std::cout << "SharedMemory::wait init " << buf;
//  std::cout << "SharedMemory::wait init " << r;
//  std::cout << "SharedMemory::wait init " << w;
//  setpointers();
//  std::cout << "SharedMemory::wait init " << buf;
//  std::cout << "SharedMemory::wait init " << r;
//  std::cout << "SharedMemory::wait init " << w;
//  std::cout << "SharedMemory::wait init " << *r;
//  std::cout << "SharedMemory::wait init " << *w;
  std::cout << "\nSharedMemory::wait init";
  while(!((*r == read) && (*w == write)))
  {
#ifdef WIN32
    Sleep(1000);
//    std::cout << "\nSharedMemory::wait loop";
#elif defined LINUX
    // todo: linux code
#else
#endif
  }
  std::cout << "\nSharedMemory::wait exit";
}

void SharedMemory::close()
{
#ifdef WIN32
  UnmapViewOfFile(buf);
  CloseHandle(mmap);
#elif defined LINUX
  // todo: linux code
#else
#endif
}

void SharedMemory::setpointers()
{
  if(buf)
  {
    version = (int*) buf;
    r = (bool*) (version + sizeof(int) + 1);
    w = (bool*) (r + sizeof(bool) + 1);
    n = (long*) (w + sizeof(bool) + 1);
    cmd = (int*) (n + sizeof(long) + 1);
    data = cmd + sizeof(int) + 1;

    *version = 1;
    *r = false;
    *w = false;
    *n = 0;
    *cmd = 0;
  }
}
