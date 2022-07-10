#include "buffermemory.h"

#include <stdlib.h>

BufferMemory::BufferMemory(int size)
{
  buffer = 0;
  resize(size);
}

BufferMemory::~BufferMemory()
{
  free(buffer);
}

int BufferMemory::size()
{
  return s;
}

void BufferMemory::resize(int size) throw (const char*)
{
  buffer = realloc(buffer, size);
  if(buffer == 0)
  {
    throw "BufferMemory::resize...Resize failed!";
  }
}

int BufferMemory::getpos()
{
  return pos;
}

void BufferMemory::setpos(int pos) throw (const char*)
{
  if(pos <= s)
  {
    this->pos = pos;
  }
  else
  {
    throw "BufferMemory::setpos...pos >= size!";
  }
}

const void* BufferMemory::getbuffer()
{
  return (const void*) buffer;
}
