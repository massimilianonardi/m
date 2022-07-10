#include "sharedmemorystream.h"

#include <cstring>

#include "functions.h"

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
    throw "SharedMemoryStream::read...buffer overflow!";
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

void SharedMemoryStream::write(const Buffer& buffer)
{
  lw.lock();
  if(size() -100 < buffer.size())
  {
    throw "SharedMemoryStream::write...buffer overflow!";
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

SERVICE_DISPATCHER_DEFINITION(SharedMemoryStream)
{
}

SERVICE_METHOD_DEFINITION(SharedMemoryStream, read)
{
  SharedMemoryStream& si = *this;
  // TODO avoid circular loops
  // TODO platform independent element (size and numbers/characters representations)
  Buffer sz;
  sz.resize(sizeof(long));
  
  // read elems buffer size
  si.read(sz);
  Sequence::resize(*(long*) sz.get());
  // raw-read elems buffer
  sz.resize(Sequence::size());
  si.read(sz);
  for(int i = 0; i < sz.size(); i++) Sequence::operator[](i) = sz[i];
  // read number of sub-Sequences
  si.read(sz);
  Sequence::links_resize(*(long*) sz.get());
  // read sub-Sequences if any
  for(long i = 0; i < (long) Sequence::size(); ++i)
  {
    // read sub-Sequence
    Sequence ss;
    read(ss);
    Sequence::operator()(i) = ss;
  }
  return *(Sequence*) this;
}

SERVICE_METHOD_DEFINITION(SharedMemoryStream, write)
{
  SharedMemoryStream& so = *this;
  *(Sequence*) this = params;
  // TODO avoid circular loops
  // TODO platform independent element (size and numbers/characters representations)
  Buffer sz;
  long sizetmp = 0;
  
  // write elems buffer size
  sizetmp = Sequence::size();
  sz.set(&sizetmp, sizeof(long));
  so.write(sz);
  // raw-write elems buffer
  sz.set(Sequence::pb, Sequence::size());
  so.write(sz);
  // write number of sub-Sequences
  sizetmp = (long) Sequence::links_size();
  sz.set(&sizetmp, sizeof(long));
  so.write(sz);
  // write sub-Sequences if any
  for(long i = 0; i < (long) Sequence::size(); ++i)
  {
    // write sub-Sequence
    write(Sequence::operator()(i));
  }
  return SERVICE_NULL;
}
