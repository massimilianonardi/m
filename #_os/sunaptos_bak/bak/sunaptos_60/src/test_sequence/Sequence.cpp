#include "Sequence.h"

#include <string>
#include <sstream>
#include <algorithm>

#include "Exception.h"
#include "debug.h"

const char* replace(const char* source, const char* find, const char* replace)
{
  std::string str, from, to;
  str = source;
  from = find;
  to = replace;
  size_t start_pos = 0;
  while((start_pos = str.find(from, start_pos)) != std::string::npos)
  {
    str.replace(start_pos, from.length(), to);
    start_pos += to.length();
  }
  return str.c_str();
}

std::string SequenceNode::text() const
{
  
  std::stringstream s;
  exception_try
  s << "\n[\n - type:" << (int) (*elements).type() << "\n - bool: " << (bool) *this << " - char: " << (char) *this << " - short int: " << (short int) *this << " - int: " << (int) *this << " - long int: " << (long int) *this << " - long long int: " << (long long int) *this << "\n - unsigned char: " << (unsigned char) *this << " - unsigned short int: " << (unsigned short int) *this << " - unsigned int: " << (unsigned int) *this << " - unsigned long int: " << (unsigned long int) *this << " - unsigned long long int: " << (unsigned long long int) *this << "\n - float: " << (float) *this << " - double: " << (double) *this << " - long double: " << (long double) *this << " - void*: " << (void*) *this << " - wchar_t: " << (wchar_t) *this << "\n - char*: " << (char*) *this << " - wchar_t*: " << (wchar_t*) *this << " \n]";
  exception_catch
  s << "[exception occurred] ";
  exception_end

  for(int i = 0; i < (long) sequences().size(); ++i)
  {
//    s << "\n[sub-Sequence " << i << "]";
//    debug_line
//    Sequence& seq = this->sequences()[i];
//    debug_line
//    s << seq.text();
    s << (*this)(i).text();
//    s << (*const_cast<SequenceNodeBasicDataTypes*>(this))(i).text();
//    s << ((SequenceNodeBasicDataTypes) this->sequences()[i]).text();
//    s << dynamic_cast<SequenceNodeBasicDataTypes*>(&(this->sequences()[i]))->text();
  }
  
  return s.str();
}

std::string SequenceNode::to_text() const
{
  std::stringstream s;
  exception_try
//  s << "\n";
  s << "$:";
  s << "i:<" << (long long) *this << ">";
  s << "f:<" << (long double) *this << ">";
  s << "f:<" << (double) *this << ">";
  const char* t = *this;
  const char* et = replace(t, ">;", "\\>;");
  et = replace(et, ">:", "\\>:");
  s << "t:<" << et << ">";
  s << "s:<" << (long long)(void*) *this << ">";
  s << "u";

  if(0 < this->sequences().size())
  {
    for(int i = 0; i < this->sequences().size(); ++i)
    {
      exception_try
      s << ":[" << (*this)(i).to_text() << "]";
      exception_catch
      s << "[exception occurred] ";
      exception_end
    }
  }
  s << ";";
  exception_catch
  s << "[exception occurred] ";
  exception_end

  return s.str();
}

SequenceNode& SequenceNode::from_text(const char* t)
{
  resize(0);
  this->sequences().resize(0);
  
  std::string s = t;
  
  Sequence start = s.substr(0, 2).c_str();
  if(start != (Sequence) "$:")
  {
    exception_throw_type(Exception::creation_failed)
  }
  
  Sequence end = s.substr(s.length() - 1).c_str();
  if(end != (Sequence) ";")
  {
    exception_throw_type(Exception::creation_failed)
  }
  
  Sequence type = s.substr(2, 2).c_str();
  
  Sequence start_content = s.substr(4, 1).c_str();
  std::string subs = s.substr(5, s.length() - 6);
  if(start_content == (Sequence) "<")
  {
    // search end content
    long n = s.find('>');
    if(n == std::string::npos)
    {
      exception_throw_type(Exception::creation_failed)
    }
    
    while(s.c_str()[n-1] == '\\')
    {
      n = s.find('>', n+1);
      // check npos
    }
    
    Sequence content = s.substr(5, n-5).c_str();
//    debug((const char*) content)
    if(type == (Sequence) "i:")
    {
      *this = atoll(content);
    }
    else if(type == (Sequence) "f:")
    {
      *this = atof(content);
    }
    else if(type == (Sequence) "t:")
    {
      *this = content;
    }
    else if(type == (Sequence) "u:")
    {
      *this = content;
    }
    else
    {
      exception_throw_type(Exception::creation_failed)
    }
    subs = s.substr(n+1, s.length() - n - 2);
  }
//  debug(subs.c_str())
  // start parse subsequences
  long n = 0;
  while((n = subs.find(':', n)) != std::string::npos)
  {
    // check n+1 = [
    Sequence start_sub = subs.substr(n+1, 1).c_str();
    if(start_sub != (Sequence) "[")
    {
      exception_throw_type(Exception::creation_failed)
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
//  debug(this->to_text());
  return *this;
}
