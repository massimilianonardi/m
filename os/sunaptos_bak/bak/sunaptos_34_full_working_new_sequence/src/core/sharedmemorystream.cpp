#include "sunaptos.h"

SharedMemoryStream::SharedMemoryStream(const char* key, long size): SharedMemory(key, size)
{
  poslr = 0;
  poslw = 0;
  posr = (long*) pdata;
  posw = (long*) (((char*) pdata) + sizeof(posr));
  ps = ((char*) pdata) + sizeof(posr) + sizeof(posw);
  *posr = 0;
  *posw = 0;
}

SharedMemoryStream::SharedMemoryStream(const char* key): SharedMemory(key)
{
  poslr = 0;
  poslw = 0;
  posr = (long*) pdata;
  posw = (long*) (((char*) pdata) + sizeof(posr));
  ps = ((char*) pdata) + sizeof(posr) + sizeof(posw);
  *posr = 0;
  *posw = 0;
}

SharedMemoryStream::~SharedMemoryStream()
{
}

long SharedMemoryStream::size()
{
  return SharedMemory::size();
}

void SharedMemoryStream::read(Buffer& buffer)
{
  lr.lock();
  if(size() -100 < buffer.size())
  {
    throw new Sequence("SharedMemoryStream::read...buffer overflow!");
  }
  if(size() -100 < *posr)
  {
    *posr = 0;
    poslr = 0;
  }
  while(*posw <= poslw)
  {
//    debug("SharedMemoryStream::read...sleeping..." << *posw << " " << poslw)
    sleepms(1000);
  }
  buffer.set((char*) ps + *posr, buffer.size());
//  debug("SharedMemoryStream::read " << (long) *(number*) buffer.get() << " " << (char*) buffer.get() << " " << (long) buffer.size() << " " << *posr << " " << *posw << " " << poslr << " " << poslw)
  *posr += buffer.size();
  poslr += buffer.size();
  lr.unlock();
}

long SharedMemoryStream::getReadPos()
{
  return *posr;
}

void SharedMemoryStream::setReadPos(long pos)
{
  *posr = pos;
}

bool SharedMemoryStream::bosi()
{
  return (*posr == 0);
}

bool SharedMemoryStream::eosi()
{
  return (*posr == size());
}

void SharedMemoryStream::write(Buffer& buffer)
{
  lw.lock();
  if(size() -100 < buffer.size())
  {
    throw new Sequence("SharedMemoryStream::write...buffer overflow!");
  }
  if(size() -100 < *posw)
  {
    *posw = 0;
    poslw = 0;
  }
  memcpy((char*) ps + *posw, buffer.get(), buffer.size());
//  debug("SharedMemoryStream::write " << (long) *(number*) buffer.get() << " " << (char*) buffer.get() << " " << (long) buffer.size() << " " << *posr << " " << *posw << " " << poslr << " " << poslw)
  *posw += buffer.size();
  poslw = *posw;
  lw.unlock();
}

long SharedMemoryStream::getWritePos()
{
  return *posw;
}

void SharedMemoryStream::setWritePos(long pos)
{
  *posw = pos;
}

bool SharedMemoryStream::boso()
{
  return (*posw == 0);
}

bool SharedMemoryStream::eoso()
{
  return (*posw == size());
}
