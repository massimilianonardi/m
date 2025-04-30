#include "buffer.h"
//#include <stdlib.h>
#include <string.h>

//#include <iostream>

Buffer::Buffer()
{
}

Buffer::Buffer(long size)
{
  resize(size);
}

Buffer::Buffer(const void* pbuf, long size)
{
  set(pbuf, size);
}

Buffer::~Buffer()
{
//  free(pb);
  delete[] pb;
}

long Buffer::size()
{
  return sz;
}

void Buffer::resize(long size)
{
  // todo: remove the memory leak, handle memory allocation exception, make a real resize (keep previous pointer) not reallocation
  sz = size;
//  pb = realloc(pb, size);
//  delete[] pb;
  pb = new char[size];
}

const void* Buffer::get()
{
  return (const void*) pb;
}

void Buffer::set(const void* pbuf, long size)
{
  resize(size); // handle resize exception
  memcpy(pb, pbuf, size);
}
