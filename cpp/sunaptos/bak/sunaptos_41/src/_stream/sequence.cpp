#include "sequence.h"

#include <cstring>
#include <sstream>

Sequence::Sequence(): t(Sequence_type::unspecified_t)
{
  *this = (long double) 0;
  t = Sequence_type::unspecified_t;
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
  t = Sequence_type::integer_t;
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
  t = Sequence_type::floating_point_t;
  return *this;
}

Sequence& Sequence::operator=(const char* e)
{
  elems.set(e, strlen(e) + 1);
  t = Sequence_type::string_ascii_t;
  return *this;
}

Sequence& Sequence::operator=(char* e)
{
  elems.set(e, strlen(e) + 1);
  t = Sequence_type::string_ascii_t;
  return *this;
}

Sequence& Sequence::operator=(Service& e)
{
  Service* pe = &e;
  elems.set(&pe, sizeof(Service*));
  t = Sequence_type::service_t;
  return *this;
}

// streamable interface
void Sequence::read(StreamInput& si)
{
  // TODO avoid circular loops
  // TODO platform independent element (size and numbers/characters representations)
  Buffer sz;
  sz.resize(sizeof(long));
  
  // read sequence type
  sz.set(&t, sizeof(t));
  si >> sz;
  t = *(Sequence_type*) sz.get();
  // read elems buffer size
  si >> sz;
  elems.resize(*(long*) sz.get());
  // raw-read elems buffer
  si >> elems;
  // read number of sub-Sequences
  si >> sz;
  resize(*(long*) sz.get());
  // read sub-Sequences if any
  for(long i = 0; i < (long) size(); ++i)
  {
    // read sub-Sequence
    si >> get(i);
  }
}

void Sequence::write(StreamOutput& so) const
{
  // TODO avoid circular loops
  // TODO platform independent element (size and numbers/characters representations)
  Buffer sz;
  long sizetmp = 0;
  
  // write sequence type
  sz.set(&t, sizeof(t));
  so << sz;
  // write elems buffer size
  sizetmp = elems.size();
  sz.set(&sizetmp, sizeof(long));
  so << sz;
  // raw-write elems buffer
  so << elems;
  // write number of sub-Sequences
  sizetmp = (long) size();
  sz.set(&sizetmp, sizeof(long));
  so << sz;
  // write sub-Sequences if any
  for(long i = 0; i < (long) size(); ++i)
  {
    // write sub-Sequence
    so << get(i);
  }
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

Sequence_type Sequence::type()
{
  return t;
}

char* Sequence::text()
{
  std::stringstream s;
  
//  s << " [type: " << (long) this->t << " - elements size: " << elems.size() << " - subSequences size: " << (long) size() << "] ";
  s << " [type: " << (long) this->type() << " - elements size: " << elems.size() << " - subSequences size: " << (long) size() << "] ";
  s << " [int: " << (int) *this << "] ";
  s << " [long: " << (long) *this << "] ";
  s << " [long long: " << (long long) *this << "] ";
  s << " [float: " << (float) *this << "] ";
  s << " [double: " << (double) *this << "] ";
  s << " [long double: " << (long double) *this << "] ";
  s << " [char*: " << (const char*) *this << "] ";
  s << "\n";

  for(int i = 0; i < (long) size(); ++i)
  {
    s << "[sub-Sequence " << i << "]";
    s << get(i).text();
//    s << (long) ((Sequence**) subseqs.get())[i] << "\n";
//    debug("[sub-Sequence " << i << " -> OK!]")
//    debug(s.str().c_str())
  }

  return (char*) s.str().c_str();
}

bool Sequence::operator==(const Sequence& e) const
{
//  return (elems == e.elems);
//  return ((t == e.t) && (elems == e.elems));
//  return ((elems == e.elems) && (subseqs == e.subseqs));
//  return ((t == e.t) && (elems == e.elems) && (subseqs == e.subseqs));
  // TODO subseqs equality by iteration of each subseq
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
