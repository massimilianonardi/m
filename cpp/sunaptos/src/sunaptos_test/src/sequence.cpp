#include "sequence.h"

#include <cstring>
#include <string>
#include <sstream>
#include <algorithm>

#include "exception.h"
#include "debug.h"

void sequence::create()
{
  data_ptr = new sequence_data();
  data_ptr->count = 1;
}

void sequence::destroy()
{
  // todo simple locking: if not linking, set destroing=true, if not linking, destroy, OR while linking empty loop, while linking empty loop, destroy
  // not here but in sequence_data within two new methods "add" "subtract", or by using flags into sequence_data
  if(!--(data_ptr->count))
  {
    if(is_service() && is_service_valid())
    {
    }
    delete data_ptr;
  }
}

sequence& sequence::copy(const sequence& sequence_node)
{
  if(&sequence_node != this)
  {
    data_ptr->data = sequence_node.data_ptr->data;
    data_ptr->links = sequence_node.data_ptr->links;
  }
  return *this;
}

sequence& sequence::move(sequence& sequence_node)
{
  if(&sequence_node != this)
  {
    // move must be interpreted as a fast data copy, if linkage must be inherited, link operation must be explictly invoked
    // the following version maintains links with this object and ignores links of other object
    data_ptr->data = std::move(sequence_node.data_ptr->data);
    data_ptr->links = std::move(sequence_node.data_ptr->links);
  }
  return *this;
}

sequence& sequence::link(sequence& sequence_node)
{
  if(&sequence_node != this)
  {
    // todo simple locking: if not destroing, set linking=true, if not destroing, link, OR set linking=true
    // releases from previous data link
    destroy();
    // set new data link
    data_ptr = sequence_node.data_ptr;
    ++(data_ptr->count);
  }
  return *this;
}

sequence::sequence(const sequence& ldr_params, const sequence& srv_params): sequence()
{
  sequence params;
  params.links_ins(ldr_params);
  params.links_ins(srv_params);
}

bool sequence::is_service_valid() const
{
  return 0;
}

bool sequence::service_validate()
{
  return 0;
}

sequence sequence::op()
{
  if(type() == sequence_type::sequence_dynamic)
  {
    // todo
  }
  else if(type() == sequence_type::sequence_executable)
  {
  }
  else
  {
    exception_throw_type(exception_type::invalid_operand)
  }
  return 0;
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
  if(is_undefined() && (size() != 0))
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
    s << hex((char*) get(), size());
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
