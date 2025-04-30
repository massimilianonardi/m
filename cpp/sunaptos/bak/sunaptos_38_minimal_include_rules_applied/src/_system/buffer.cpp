#include "buffer.h"
#include <cstdlib>
#include <cstring>

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

Buffer::Buffer(const Buffer& b): pb(0), sz(0)
{
  *this = b;
}

Buffer& Buffer::operator=(const Buffer& b)
{
  if(&b != this)
  {
    set(b.pb, b.sz);
  }
  return *this;
}

Buffer::~Buffer()
{
  free(pb);
  pb = 0;
}

long Buffer::size()
{
  return sz;
}

void Buffer::resize(long size)
{
  void* ptmp = pb;
  pb = realloc(pb, size);
  if((pb == 0) && (size != 0))
  {
    pb = ptmp;
    throw "[Buffer::resize] failed to allocate memory!";
  }
  else
  {
    sz = size;
  }
  if(size == 0)
  {
    pb = 0;
  }
}

const void* Buffer::get()
{
  return (const void*) pb;
}

void Buffer::set(const void* pbuf, long size)
{
  resize(size);
  memcpy(pb, pbuf, size);
}
