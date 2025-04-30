#include "Sequence.h"

#include <cstring>
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

Sequence::Sequence(): t(sequence_type::unspecified_t)
{
  *this = (long double) 0;
  t = sequence_type::unspecified_t;
}

Sequence::~Sequence()
{
  elems.resize(0);
  resize(0);
}

// copy
Sequence::Sequence(const Sequence& e)
{
  *this = e;
}

Sequence& Sequence::operator=(const Sequence& e)
{
  return copy(e);
}

Sequence& Sequence::copy(const Sequence& e)
{
  if(&e != this)
  {
    t = e.t;
    elems = e.elems;
    subseqs = e.subseqs;
  }
  return *this;
}

// type conversions
Sequence::Sequence(bool e)
{
  *this = e;
}

Sequence::Sequence(int e)
{
  *this = e;
}

Sequence::Sequence(long e)
{
  *this = e;
}

Sequence::Sequence(long long e)
{
  *this = e;
}

Sequence::Sequence(float e)
{
  *this = e;
}

Sequence::Sequence(double e)
{
  *this = e;
}

Sequence::Sequence(long double e)
{
  *this = e;
}

Sequence::Sequence(const char* e)
{
  *this = e;
}

Sequence::Sequence(char* e)
{
  *this = e;
}

Sequence::Sequence(Service* e)
{
  *this = e;
}

Sequence::Sequence(Service& e)
{
  *this = e;
}

Sequence::operator bool() const
{
  return *(bool*) elems.get();
}

Sequence::operator int() const
{
  return *(int*) elems.get();
}

Sequence::operator long() const
{
  return *(long*) elems.get();
}

Sequence::operator long long() const
{
  return *(long long*) elems.get();
}

Sequence::operator float() const
{
//  return *(float*) elems.get();
  return *(long double*) elems.get();
}

Sequence::operator double() const
{
//  return *(double*) elems.get();
  return *(long double*) elems.get();
}

Sequence::operator long double() const
{
  return *(long double*) elems.get();
}

Sequence::operator const char*() const
{
  return (const char*) elems.get();
}

Sequence::operator char*() const
{
  return (char*) elems.get();
}

Sequence::operator Service*() const
{
  return *(Service**) elems.get();
}

Sequence::operator Service&() const
{
  return **(Service**) elems.get();
}

Sequence& Sequence::operator=(bool e)
{
  return *this = (long long) e;
}

Sequence& Sequence::operator=(int e)
{
  return *this = (long long) e;
}

Sequence& Sequence::operator=(long e)
{
  return *this = (long long) e;
}

Sequence& Sequence::operator=(long long e)
{
  elems.set(&e, sizeof(long long));
  t = sequence_type::integer_t;
  return *this;
}

Sequence& Sequence::operator=(float e)
{
  return *this = (long double) e;
}

Sequence& Sequence::operator=(double e)
{
  return *this = (long double) e;
}

Sequence& Sequence::operator=(long double e)
{
  elems.set(&e, sizeof(long double));
  t = sequence_type::floating_point_t;
  return *this;
}

Sequence& Sequence::operator=(const char* e)
{
  elems.set(e, strlen(e) + 1);
  t = sequence_type::character_t;
  return *this;
}

Sequence& Sequence::operator=(char* e)
{
  elems.set(e, strlen(e) + 1);
  t = sequence_type::character_t;
  return *this;
}

Sequence& Sequence::operator=(Service* e)
{
  elems.set(&e, sizeof(Service*));
  t = sequence_type::service_t;
  return *this;
}

Sequence& Sequence::operator=(Service& e)
{
  Service* pe = &e;
  *this = pe;
  return *this;
}

// access
//Sequence& Sequence::get(const Sequence& i)
//Sequence& Sequence::get(Sequence i)
Sequence& Sequence::get(long i) const
{
  long ind = i;
  if(ind < 0)
  {
    throw "[Sequence::get] Sequence index < 0!";
  }
  else if((long) size() <= ind)
  {
    throw "[Sequence::get] Sequence index >= size!";
  }
//  return **(Sequence**)((char*) subseqs.get() + ind * sizeof(Sequence**));
  return *((Sequence**) subseqs.get())[ind];
}

Sequence& Sequence::get(long i)
{
  long ind = i;
  if(ind < 0)
  {
    throw "[Sequence::get] Sequence index < 0!";
  }
  else if((long) size() <= ind)
  {
    resize(ind + 1);
  }
//  return **(Sequence**)((char*) subseqs.get() + ind * sizeof(Sequence**));
  return *((Sequence**) subseqs.get())[ind];
}

//Sequence& Sequence::del(Sequence& i)
Sequence& Sequence::del(long i)
{
//  long ind = i;
  if((long) i < 0 || (long) size() <= (long) i)
  {
    throw "[Sequence::del] Sequence index < 0 or greater than size!";
  }
  delete ((Sequence**) subseqs.get())[(long) i];
  move(i, i + 1, size() - i - 1);
  resize((long) size() - 1);
  return *this;
}

void Sequence::move(long i_dest, long i_source, long n)
{
  memmove(&((Sequence**) subseqs.get())[i_dest], &((Sequence**) subseqs.get())[i_source], n * sizeof(Sequence*));
}

//void Sequence::resize(Sequence& size)
//void Sequence::resize(Sequence size)
void Sequence::resize(long size)
{
  long oldsize = (long) this->size();
  if((long) size < oldsize)
  {
    for(long ind = oldsize; ind < (long) size; ++ind)
    {
      delete ((Sequence**) subseqs.get())[ind];
    }
  }
  subseqs.resize((long) size * sizeof(Sequence*));
  if((long) size > oldsize)
  {
    for(long ind = oldsize; ind < (long) size; ++ind)
    {
      ((Sequence**) subseqs.get())[ind] = new Sequence();
    }
  }
}

//Sequence Sequence::size()
long Sequence::size() const
{
  return (long long) subseqs.size() / sizeof(Sequence*);
}

sequence_type Sequence::type() const
{
  return t;
}

const char* Sequence::to_text() const
{
  std::stringstream s;
  exception_try
//  s << "\n";
  s << "$:";
  if(type() == sequence_type::integer_t)
  {
    s << "i:<" << (long long) *this << ">";
  }
  else if(type() == sequence_type::floating_point_t)
  {
//    s << "f:<" << (long double) *this << ">";
    s << "f:<" << (double) *this << ">";
  }
  else if(type() == sequence_type::character_t)
  {
    // TODO: escape characters >: and >; with \>: and \>; (NB >; will become \>; and \>; will become \\>; and so on)
    const char* t = *this;
    const char* et = replace(t, ">;", "\\>;");
    et = replace(et, ">:", "\\>:");
    s << "t:<" << et << ">";
//    s << "t:<" << (const char*) *this << ">";
  }
  else if(type() == sequence_type::service_t)
  {
    s << "s:<" << (long long)&(Service&) *this << ">";
  }
  else
  {
    s << "u";
  }

  if(0 < size())
  {
    for(int i = 0; i < (long) size(); ++i)
    {
      exception_try
      s << ":[" << get(i).to_text() << "]";
      exception_catch
      s << "[exception occurred] ";
      exception_end
    }
  }
  s << ";";
  exception_catch
  s << "[exception occurred] ";
  exception_end

  return (char*) s.str().c_str();
}

Sequence& Sequence::from_text(const char* t)
{
  this->t = sequence_type::unspecified_t;
  elems.resize(0);
  resize(0);
  
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
  if(type == (Sequence) "i:")
  {
    this->t = sequence_type::integer_t;
  }
  else if(type == (Sequence) "f:")
  {
    this->t = sequence_type::floating_point_t;
  }
  else if(type == (Sequence) "t:")
  {
    this->t = sequence_type::character_t;
  }
  else if(type == (Sequence) "u:")
  {
    this->t = sequence_type::unspecified_t;
  }
  else
  {
    exception_throw_type(Exception::creation_failed)
  }
  
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
    if(this->t == sequence_type::character_t)
    {
      *this = content;
    }
    else if(this->t == sequence_type::unspecified_t)
    {
      *this = content;
    }
    else if(this->t == sequence_type::integer_t)
    {
      *this = atoll(content);
    }
    else if(this->t == sequence_type::floating_point_t)
    {
      // TODO: support long double (atof returns double)
      *this = atof(content);
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
    *this << Sequence().from_text(subs.substr(n_start_sub, n - n_start_sub).c_str());
  }
//  debug(this->to_text());
  return *this;
}

char* Sequence::text() const
{
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
  bool res = ((t == e.t) && (elems == e.elems));
  for(long i = 0; i < size(); ++i)
  {
    res = res && (get(i) == e.get(i));
  }
  return res;
}

//bool Sequence::operator<(const Sequence& e) const
//{
//}
