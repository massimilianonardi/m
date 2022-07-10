#include "sequence.h"

#include <cstring>
#include <string>
#include <sstream>
#include <algorithm>

#include "Exception.h"
#include "debug.h"
#include "service.h"

void sequence::destroy()
{
  if(!--*spcount)
  {
    if(is_service() && is_service_valid())
    {
      loader.destroy((service*) (*this));
    }
    free(pb);
    pb = 0;
    sz = 0;
    delete sequence_links;
    delete spcount;
  }
}

sequence::sequence(const sequence& ldr_params, const sequence& srv_params): sequence()
{
  sequence params;
  params.links_ins(ldr_params);
  params.links_ins(srv_params);
  *this = loader.create(params);
  (*this).links_ins(loader.id(0));
}

sequence& sequence::copy(const sequence& sequence_node)
{
  if(&sequence_node != this)
  {
    set(sequence_node.pb, sequence_node.sz);
    (*this)[sz] = sequence_node[sequence_node.sz];
    *sequence_links = *(sequence_node.sequence_links);
  }
  return *this;
}

sequence& sequence::move(sequence& sequence_node)
{
  if(&sequence_node != this)
  {
    spcount = sequence_node.spcount;
    pb = sequence_node.pb;
    sz = sequence_node.sz;
    sequence_links = sequence_node.sequence_links;
    
    *(sequence_node.spcount) = 0;
    sequence_node.pb = 0;
    sequence_node.sz = 0;
    sequence_node.sequence_links = 0;
  }
  return *this;
}

sequence& sequence::link(sequence& sequence_node)
{
  if(&sequence_node != this)
  {
    ++*spcount;
    pb = sequence_node.pb;
    sz = sequence_node.sz;
    sequence_links = sequence_node.sequence_links;
  }
  return *this;
}

bool sequence::operator==(const sequence& sequence_node) const
{
  bool buffer_eq = false;
  if(size() == sequence_node.size())
  {
    if(size() == 0)
    {
      buffer_eq = true;
    }
    else
    {
      buffer_eq = (0 == memcmp(pb, sequence_node.pb, sz));
    }
  }
  return buffer_eq && (*sequence_links == *(sequence_node.sequence_links));
}

sequence& sequence::resize(const SequenceIndex& size)
{
  void* ptmp = pb;
//  pb = realloc(pb, size);
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
//  if(size == 0)
//  {
//    pb = 0;
//  }
  return *this;
}

sequence& sequence::set(const void* pbuf, const SequenceIndex& size)
{
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

sequence& sequence::ins(const element& e, const SequenceIndex& index)
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

sequence& sequence::ins(const sequence& b, const SequenceIndex& index)
{
  if(sz < index)
  {
    exception_throw_type(exception_type::index_out_of_boundaries)
  }
  
  // the following instruction allows to safely add itself
  SequenceIndex bsz = b.sz;
  resize(sz + bsz);
  memmove(((char*) pb) + index + bsz, ((char*) pb) + index, sz - bsz - index);
  memcpy(((char*) pb) + index, ((char*) b.pb), bsz);
  return *this;
}

sequence& sequence::del(const SequenceIndex& index, const SequenceIndex& size)
{
  if(sz <= index)
  {
    exception_throw_type(exception_type::index_out_of_boundaries)
  }
  
  SequenceIndex ndel = size;
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

sequence& sequence::move(const SequenceIndex& index, const SequenceIndex& size, const SequenceIndex& new_index)
{
  if((sz <= index) || (sz <= new_index) || (sz < index + size) || (sz < new_index + size))
  {
    exception_throw_type(exception_type::index_out_of_boundaries)
  }
  
  sequence tmp;
  tmp.set(((char*) pb) + index, size);
  del(index, size);
  ins(tmp, new_index);
  return *this;
}

bool sequence::is_service_valid() const
{
  return loader.search(*this);
}

bool sequence::service_validate()
{
  return *this = loader.validate(true);
}

sequence sequence::op()
{
  if(type() == sequence_type::sequence_dynamic)
  {
    // todo
  }
  else if(type() == sequence_type::sequence_executable)
  {
    service* srv = (*this)(0);
    if(!(*this)(0).service_validate())
    {
      exception_throw_type(exception_type::invalid_operand)
    }
    return (*this)(0)->f((*this)(1), (*this)(2));
  }
  else
  {
    exception_throw_type(exception_type::invalid_operand)
  }
}

std::string replace(const std::string& source, const std::string& find, const std::string& replace)
{
  std::string str = source;
  size_t start_pos = 0;
  while((start_pos = str.find(find, start_pos)) != std::string::npos)
  {
    str.replace(start_pos, find.length(), replace);
    start_pos += replace.length();
  }
  return str;
}

std::string hex(const char* source, int size)
{
  const char * hexmap = "0123456789abcdef";
  std::string hex(size * 2, ' ');
  for(int i = 0; i < size; ++i)
  {
    hex[i * 2] = hexmap[(source[i] >> 4) & 0x0F];
    hex[i * 2 + 1] = hexmap[source[i] & 0x0F];
  }
  return hex;
}

std::string sequence::to_string() const
{
  std::stringstream s;
  exception_try
  s << "$:";
  s << (unsigned int) type() << ":<";
  
  // specific type format
  if(is_undefined())
  {
    // escape text from reserved syntax
    std::string t = (const char*) *this;
    t = replace(t, ">;", "\\>;");
    t = replace(t, ">:", "\\>:");
    s << t;
  }
  else if(type() == sequence_type::number_ieee754_double)
  {
    s << (double) *this;
  }
  else if((type() == sequence_type::pointer) || (type() == sequence_type::service))
  {
    s << hex((char*) pb, sz);
  }
  else
  {
    s << hex((char*) pb, sz);
  }
  
  s << ">";
  
  // recursive call to links
  if(0 < this->links_size())
  {
    for(int i = 0; i < this->links_size(); ++i)
    {
      exception_try
      s << ":[" << (*this)(i).to_string() << "]";
      exception_catch
      s << "[exception occurred]";
      exception_end
    }
  }
  
  // termination
  s << ";";
  exception_catch
  s << "[exception occurred]";
  exception_end

  return s.str();
}

sequence& sequence::from_string(const char* str)
{
  resize(0);
  this->links_resize(0);
  
  std::string s = str;
  
  sequence start = s.substr(0, 2).c_str();
  if(start != (sequence) "$:")
  {
    exception_throw_type(exception_type::creation_failed)
  }
  
  sequence end = s.substr(s.length() - 1).c_str();
  if(end != (sequence) ";")
  {
    exception_throw_type(exception_type::creation_failed)
  }
  
  sequence type = s.substr(2, 2).c_str();
  
  sequence start_content = s.substr(4, 1).c_str();
  std::string subs = s.substr(5, s.length() - 6);
  if(start_content == (sequence) "<")
  {
    // search end content
    long n = s.find('>');
    if(n == std::string::npos)
    {
      exception_throw_type(exception_type::creation_failed)
    }
    
    while(s.c_str()[n-1] == '\\')
    {
      n = s.find('>', n+1);
      // check npos
    }
    
    sequence content = s.substr(5, n-5).c_str();
    if(type == (sequence) "n:")
    {
      *this = atof(content);
    }
    else if(type == (sequence) "s:")
    {
      *this = content;
    }
    else if(type == (sequence) "u:")
    {
      *this = content;
    }
    else
    {
      exception_throw_type(exception_type::creation_failed)
    }
    subs = s.substr(n+1, s.length() - n - 2);
  }
  // start parse subsequences
  long n = 0;
  while((n = subs.find(':', n)) != std::string::npos)
  {
    // check n+1 = [
    sequence start_sub = subs.substr(n+1, 1).c_str();
    if(start_sub != (sequence) "[")
    {
      exception_throw_type(exception_type::creation_failed)
    }
    long n_start_sub = n+2;
    // set n = ] (without escapes)
    n = subs.find(']', n+2);
    while(subs.c_str()[n-1] == '\\')
    {
      n = s.find(']', n+1);
      // check npos
    }
//    this->sequences() << Sequence().from_text(subs.substr(n_start_sub, n - n_start_sub).c_str());
//    *this << Sequence().from_text(subs.substr(n_start_sub, n - n_start_sub).c_str());
  }
  return *this;
}
