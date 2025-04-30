#include "Buffer.h"

#include "Exception.h"
#include "debug.h"

Buffer& Buffer::resize(const buffer_index& size)
{
  void* ptmp = pb;
//  pb = realloc(pb, size);
  // always add a zero at buffer end
  pb = realloc(pb, size + 1);
  if((pb == 0) && (size != 0))
  {
    pb = ptmp;
    exception_throw_type(Exception::memory_allocation_failed)
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
  if(sz < index)
  {
    exception_throw_type(Exception::index_out_of_boundaries)
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
    exception_throw_type(Exception::index_out_of_boundaries)
  }
  
  // the following instruction allows to safely add itself
  int bsz = b.size();
  resize(sz + bsz);
  memmove(((char*) pb) + index + bsz, ((char*) pb) + index, sz - bsz - index);
  memcpy(((char*) pb) + index, ((char*) b.pb), bsz);
//  for(int i = 0; i < b.size(); i++)
//  {
//    ins(b[i], index + i);
//  }
  return *this;
}

Buffer& Buffer::del(const buffer_index& index, const buffer_index& size)
{
  memmove(((char*) pb) + index, ((char*) pb) + index + size, this->size() - 1 - index - size);
  return *this;
}

Buffer& Buffer::move(const buffer_index& index, const buffer_index& size, const buffer_index& new_index)
{
  memmove(((char*) pb) + new_index, ((char*) pb) + index, size);
  return *this;
}
