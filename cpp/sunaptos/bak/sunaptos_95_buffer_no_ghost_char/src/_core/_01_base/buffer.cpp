#include "buffer.h"

#include <cstdlib>
#include <cstring>

buffer& buffer::operator=(const buffer& b)
{
  if(&b != this)
  {
    set(b.pb, b.sz);
    (*this)[sz] = b[b.sz];
  }
  return *this;
}

buffer& buffer::operator=(buffer&& b)
{
  if(&b != this)
  {
    free(pb);
    pb = b.pb;
    sz = b.sz;
    b.pb = 0;
    b.sz = 0;
    b.resize(0);
  }
  return *this;
}

bool buffer::operator==(const buffer& b) const
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

buffer& buffer::resize(const buffer_index& size)
{
  if(size < 0)
  {
    exception_throw_type(exception_type::invalid_operand)
  }
  
  void* ptmp = pb;
  // always add a zero at buffer end
  pb = realloc(pb, size + 1);
  if((pb == 0) && (size != 0))
  {
    pb = ptmp;
    exception_throw_type(exception_type::memory_allocation_failed)
  }
  else
  {
    sz = size;
    // always add a zero at buffer end
    ((char*) pb)[size] = 0;
  }
  return *this;
}

buffer& buffer::set(const void* pbuf, const buffer_index& size)
{
  if(size < 0)
  {
    exception_throw_type(exception_type::invalid_operand)
  }
  
  if(size == 0)
  {
    resize(0);
  }
  else
  {
    if(pbuf == 0)
    {
      exception_throw_type(exception_type::null_pointer)
    }
    else
    {
      resize(size);
      memcpy(pb, pbuf, size);
    }
  }
  return *this;
}

buffer& buffer::set(const void* pbuf, const buffer_index& size, const buffer_index& offset)
{
  if(size < 0)
  {
    exception_throw_type(exception_type::invalid_operand)
  }
  
  if(size == 0)
  {
    resize(0);
  }
  else
  {
    if(pbuf == 0)
    {
      exception_throw_type(exception_type::null_pointer)
    }
    else
    {
      resize(size);
      memcpy(pb, (void*)(((char*) pbuf) + offset), size);
    }
  }
  return *this;
}

buffer& buffer::ins(const char& e, const buffer_index& index)
{
  if(sz < index)
  {
    exception_throw_type(exception_type::index_out_of_boundaries)
  }
  
  resize(sz + 1);
  if(index < sz - 1)
  {
    memmove(((char*) pb) + index + 1, ((char*) pb) + index, sz - 1 - index);
  }
  operator[](index) = e;
  return *this;
}

buffer& buffer::ins(const buffer& b, const buffer_index& index)
{
  if(sz < index)
  {
    exception_throw_type(exception_type::index_out_of_boundaries)
  }
  
  // the following instruction allows to safely add itself
  buffer_index bsz = b.size();
  resize(sz + bsz);
  memmove(((char*) pb) + index + bsz, ((char*) pb) + index, sz - bsz - index);
  memcpy(((char*) pb) + index, ((char*) b.pb), bsz);
  return *this;
}

buffer& buffer::del(const buffer_index& index, const buffer_index& size)
{
  if(sz <= index)
  {
    exception_throw_type(exception_type::index_out_of_boundaries)
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

buffer& buffer::move(const buffer_index& index, const buffer_index& size, const buffer_index& new_index)
{
  if((sz <= index) || (sz <= new_index) || (sz < index + size) || (sz < new_index + size))
  {
    exception_throw_type(exception_type::index_out_of_boundaries)
  }
  
  buffer tmp;
  tmp.set(((char*) pb) + index, size);
  del(index, size);
  ins(tmp, new_index);
  return *this;
}
