#include "buffer.h"
#include <stdlib.h>
#include <string.h>

#include <iostream>

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
  free(pb);
}

long Buffer::size()
{
  return sz;
}

void Buffer::resize(long size)
{
  sz = size;
//  pb = realloc(pb, size);
//  delete pb;
  pb = new char[size];
}

const void* Buffer::get()
{
//  std::cout << "\nBuffer::get size = " << sz << " n = "  << *(long*) pb << " s = " << (char*) pb;
  return (const void*) pb;
}

void Buffer::set(const void* pbuf, long size)
{
  resize(size); // handle resize exception
  memcpy(pb, pbuf, size);
//  std::cout << "\nBuffer::set size = " << sz << " n = "  << *(long*) pb << " s = " << (char*) pb;
}
