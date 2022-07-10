#include "sharedmemorystream.h"
#include <string.h>

SharedMemoryStream::SharedMemoryStream()
{
}

SharedMemoryStream::~SharedMemoryStream()
{
}

long SharedMemoryStream::size()
{
  return SharedMemory::size();
}

void SharedMemoryStream::read(Buffer* buffer)
{
  buffer->set((char*) pdata + posr, buffer->size());
  posr += buffer->size();
}

long SharedMemoryStream::getReadPos()
{
  return posr;
}

void SharedMemoryStream::setReadPos(long pos)
{
  posr = pos;
}

bool SharedMemoryStream::bosi()
{
  return (posr == 0);
}

bool SharedMemoryStream::eosi()
{
  return (posr == size());
}

void SharedMemoryStream::write(Buffer* buffer)
{
  memcpy((char*) pdata + posw, buffer->get(), buffer->size());
  posw += buffer->size();
}

long SharedMemoryStream::getWritePos()
{
  return posw;
}

void SharedMemoryStream::setWritePos(long pos)
{
  posw = pos;
}

bool SharedMemoryStream::boso()
{
  return (posw == 0);
}

bool SharedMemoryStream::eoso()
{
  return (posw == size());
}
