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

Sequence::~Sequence()
{
  elems.resize(0);
//  sequences.resize(0);
}

const char* Sequence::to_text() const
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
  s << "s:<" << (long long)&(Service&) *this << ">";
  s << "u";

//  if(0 < (integer) sequences.size())
//  {
//    for(int i = 0; i < (integer) sequences.size(); ++i)
//    {
//      exception_try
//      s << ":[" << sequences.get(i).to_text() << "]";
//      exception_catch
//      s << "[exception occurred] ";
//      exception_end
//    }
//  }
  s << ";";
  exception_catch
  s << "[exception occurred] ";
  exception_end

  return (char*) s.str().c_str();
}

Sequence& Sequence::from_text(const char* t)
{
  resize(0);
//  sequences.resize(0);
  
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
//    *this << Sequence().from_text(subs.substr(n_start_sub, n - n_start_sub).c_str());
  }
//  debug(this->to_text());
  return *this;
}

char* Sequence::text() const
{
  to_text();
  /*
  std::stringstream s;
  exception_try
//  s << "\n";
  s << "[seq: " << (long long) this << "] ";
  if(type() == sequence_type::integer_t)
  {
    s << "[integer_t(" << elems.size() << ") = " << (long long) *this << "] ";
  }
  else if(type() == sequence_type::floating_point_t)
  {
    s << "[floating_point_t(" << elems.size() << ") = " << (long double) *this << "] ";
  }
  else if(type() == sequence_type::character_t)
  {
    s << "[string_ascii_t(" << elems.size() << ") = " << (const char*) *this << "] ";
  }
  else if(type() == sequence_type::service_t)
  {
    s << "[service_t(" << elems.size() << ") = " << (long long)&(Service&) *this << "] ";
  }
  else
  {
    s << "[unspecified_t] ";
//    s << "[type: " << (long) this->type() << " - size: " << elems.size() << "] ";
//    s << "[int: " << (int) *this << "] ";
//    s << "[long: " << (long) *this << "] ";
//    s << "[long long: " << (long long) *this << "] ";
//    s << "[float: " << (float) *this << "] ";
//    s << "[double: " << (double) *this << "] ";
//    s << "[long double: " << (long double) *this << "] ";
//    s << "[char*: " << (const char*) *this << "] ";
//    s << "[Service*: " << (long)&(Service&) *this << "] ";
  }

  if(0 < size())
  {
    s << "[n.: " << (long) size() << "] ";
    s << "\n";
    s << "{";
    for(int i = 0; i < (long) size(); ++i)
    {
      exception_try
      s << "\n";
      s << "  ";
      s << "[sub-seq: " << i << "] ";
      s << replace(get(i).text(), "\n", "\n  ");
//      s << replace(get(i).text() + 1, "\n", "\n  ");
//      s << get(i).text();
      exception_catch
      s << "[exception occurred] ";
      exception_end
    }
    s << "\n";
    s << "}";
  }
//  s << "\n";
  exception_catch
  s << "[exception occurred] ";
  exception_end

  return (char*) s.str().c_str();
  */
}

//char* Sequence::text() const
//{
//  std::stringstream s;
//  
////  s << " [type: " << (long) this->t << " - elements size: " << elems.size() << " - subSequences size: " << (long) size() << "] ";
//  s << " [type: " << (long) this->type() << " - elements size: " << elems.size() << " - subSequences size: " << (long) size() << "] ";
//  s << " [int: " << (int) *this << "] ";
//  s << " [long: " << (long) *this << "] ";
//  s << " [long long: " << (long long) *this << "] ";
//  s << " [float: " << (float) *this << "] ";
//  s << " [double: " << (double) *this << "] ";
//  s << " [long double: " << (long double) *this << "] ";
//  s << " [char*: " << (const char*) *this << "] ";
//  s << "\n";
//
//  for(int i = 0; i < (long) size(); ++i)
//  {
//    s << "[sub-Sequence " << i << "]";
//    s << get(i).text();
////    s << (long) ((Sequence**) subseqs.get())[i] << "\n";
////    debug("[sub-Sequence " << i << " -> OK!]")
////    debug(s.str().c_str())
//  }
//
//  return (char*) s.str().c_str();
//}

bool Sequence::operator==(const Sequence& e) const
{
//  return (elems == e.elems);
//  return ((t == e.t) && (elems == e.elems));
//  return ((elems == e.elems) && (subseqs == e.subseqs));
//  return ((t == e.t) && (elems == e.elems) && (subseqs == e.subseqs));
  // TODO subseqs equality by iteration of each subseq
//  debug(this->text())
//  debug(e.text())
  bool res = (elems == e.elems);
//  res = res && (sequences == e.sequences);
  return res;
}

//bool Sequence::operator<(const Sequence& e) const
//{
//}
