#include "sunaptos.h"

Buffer::Buffer(): pb(0), sz(0)
{
}

Buffer::Buffer(long size): pb(0), sz(0)
{
  resize(size);
}

Buffer::Buffer(const void* pbuf, long size): pb(0), sz(0)
{
  set(pbuf, size);
}

Buffer::~Buffer()
{
//  pb = (char*) realloc(pb, 1);
//  free(pb);
//  delete[] pb;
//  pb = 0;
}

long Buffer::size()
{
  return sz;
}

void Buffer::resize(long size)
{
  // todo: remove the memory leak, handle memory allocation exception, make a real resize (keep previous pointer) not reallocation
  sz = size;
  pb = (char*) realloc(pb, size);
//  delete[] pb;
//  pb = new char[size];
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
