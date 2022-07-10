#include "Buffer.h"

#include "Exception.h"

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

long Buffer::size() const
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
    exception_throw_type(Exception::memory_allocation_failed)
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

const void* Buffer::get() const
{
  return (const void*) pb;
}

void Buffer::set(const void* pbuf, long size)
{
  if(size == 0)
  {
    resize(0);
  }
  else
  {
    if(pbuf == 0)
    {
      exception_throw_type(Exception::null_pointer)
    }
    else
    {
      exception_try
      resize(size);
      memcpy(pb, pbuf, size);
      exception_catch
      exception_rethrow_end
    }
  }
}

bool Buffer::operator==(const Buffer& b) const
{
  if(size() == b.size())
  {
    if(size() == 0)
    {
      return true;
    }
    else
    {
      exception_try
      return (0 == memcmp(get(), b.get(), size()));
      exception_catch
      exception_rethrow_end
    }
  }
  else
  {
    return false;
  }
  return false;
}
