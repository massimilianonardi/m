#include "Buffer.h"

#include <cstring>

#include "Exception.h"
#include "debug.h"

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
      return (0 == memcmp(get(), b.get(), size()));
    }
  }
  else
  {
    return false;
  }
  return false;
}

Buffer& Buffer::resize(const buffer_index& size)
{
  void* ptmp = pb;
//  pb = realloc(pb, size);
  // always add a zero at buffer end
  pb = realloc(pb, size + 1);
  if((pb == 0) && (size != 0))
  {
    pb = ptmp;
    exception_throw_type(ExceptionType::memory_allocation_failed)
  }
  else
  {
    sz = size;
    // always add a zero at buffer end
    ((char*) pb)[size] = 0;
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
      debug_line
      exception_throw_type(ExceptionType::null_pointer)
    }
    else
    {
      resize(size);
      memcpy(pb, pbuf, size);
    }
  }
  return *this;
}

Buffer& Buffer::ins(const char& e, const buffer_index& index)
{
  if(sz < index)
  {
    exception_throw_type(ExceptionType::index_out_of_boundaries)
  }
  
  resize(sz + 1);
  if(index < sz - 1)
  {
    memmove(((char*) pb) + index + 1, ((char*) pb) + index, sz - 1 - index);
  }
  operator[](index) = e;
  return *this;
}

Buffer& Buffer::ins(const Buffer& b, const buffer_index& index)
{
  if(sz < index)
  {
    exception_throw_type(ExceptionType::index_out_of_boundaries)
  }
  
  // the following instruction allows to safely add itself
  buffer_index bsz = b.size();
  resize(sz + bsz);
  memmove(((char*) pb) + index + bsz, ((char*) pb) + index, sz - bsz - index);
  memcpy(((char*) pb) + index, ((char*) b.pb), bsz);
  return *this;
}

Buffer& Buffer::del(const buffer_index& index, const buffer_index& size)
{
  if(sz <= index)
  {
    exception_throw_type(ExceptionType::index_out_of_boundaries)
  }
  
  buffer_index ndel = size;
  if(sz < index + size)
  {
    ndel = sz - index;
  }
  
  if(index + ndel < sz)
  {
    memmove(((char*) pb) + index, ((char*) pb) + index + ndel, sz - index - ndel);
  }
  resize(sz - ndel);
  return *this;
}

Buffer& Buffer::move(const buffer_index& index, const buffer_index& size, const buffer_index& new_index)
{
  if((sz <= index) || (sz <= new_index) || (sz < index + size) || (sz < new_index + size))
  {
    exception_throw_type(ExceptionType::index_out_of_boundaries)
  }
  
  Buffer tmp;
  tmp.set(((char*) pb) + index, size);
  del(index, size);
  ins(tmp, new_index);
  return *this;
}
