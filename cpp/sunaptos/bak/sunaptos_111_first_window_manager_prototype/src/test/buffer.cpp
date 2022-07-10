#include "buffer.h"
#include "exception.h"

#include <cstdlib>
#include <cstring>
#include <utility>

buffer::buffer(): pb(0), sz(0)
{
}

buffer::~buffer()
{
  free(pb);
  pb = 0;
}

buffer::buffer(const buffer& b): buffer()
{
  *this = b;
}

buffer::buffer(buffer&& b): buffer()
{
  *this = std::move(b);
}

buffer& buffer::operator=(const buffer& b)
{
  if(&b != this)
  {
    set(b.pb, b.sz);
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

bool buffer::operator!=(const buffer& b) const
{
  return !operator==(b);
}

buffer& buffer::resize(const buffer_index& size)
{
  if(size < 0)
  {
    exception_throw_type(exception_type::invalid_operand)
  }
  else if(size == 0)
  {
    free(pb);
    pb = 0;
    sz = 0;
  }
  else
  {
    void* ptmp = pb;
    pb = realloc(pb, size);
    if((pb == 0) && (size != 0))
    {
      pb = ptmp;
      exception_throw_type(exception_type::memory_allocation_failed)
    }
    else
    {
      sz = size;
    }
  }
  return *this;
}

buffer_index buffer::size() const
{
  return sz;
}

char& buffer::operator[](const buffer_index& index)
{
  if((sz <= index) || (index < 0))
  {
    exception_throw_type(exception_type::index_out_of_boundaries)
  }
  return ((char*) get())[index];
}

const char& buffer::operator[](const buffer_index& index) const
{
  if((sz <= index) || (index < 0))
  {
    exception_throw_type(exception_type::index_out_of_boundaries)
  }
  return ((char*) get())[index];
}

const void* buffer::get() const
{
  return (const void*) pb;
}

const void* buffer::get(const buffer_index& index) const
{
  if((sz <= index) || (index < 0))
  {
    exception_throw_type(exception_type::index_out_of_boundaries);
  }
  return (const void*)(((char*) pb) + index);
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
      resize(size + offset);
      memcpy((void*)(((char*) pb) + offset), pbuf, size);
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

buffer& buffer::ins(const char& e)
{
  return ins(e, sz - 1);
}

buffer& buffer::ins(const buffer& b)
{
  return ins(b, sz - 1);
}

buffer& buffer::del(const buffer_index& index, const buffer_index& size)
{
  if(sz <= index)
  {
    exception_throw_type(exception_type::index_out_of_boundaries)
  }
  
  // if requested number of elements to delete is greater than available, then delete only those available without throwing an exception
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

buffer& buffer::del(const buffer_index& index)
{
  return del(index, 1);
}

buffer& buffer::del()
{
  return del(sz - 1, 1);
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
