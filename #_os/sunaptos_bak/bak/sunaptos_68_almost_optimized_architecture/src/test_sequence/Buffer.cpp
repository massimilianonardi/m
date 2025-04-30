#include "Buffer.h"

#include "Exception.h"

Buffer& Buffer::resize(const buffer_index& size)
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
  return *this;
}

Buffer& Buffer::set(const void* pbuf, const buffer_index& size)
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
  return *this;
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

Buffer& Buffer::ins(const char& e, const buffer_index& index)
{
  // todo
  return *this;
}

Buffer& Buffer::ins(const Buffer& b, const buffer_index& index)
{
  // todo
  return *this;
}

Buffer& Buffer::del(const buffer_index& index, const buffer_index& size)
{
  // todo
  return *this;
}

Buffer& Buffer::move(const buffer_index& index, const buffer_index& size, const buffer_index& new_index)
{
  // todo
  return *this;
}
