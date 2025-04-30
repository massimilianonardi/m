#include "sunaptos.h"

sequence::sequence(): t(sequence_type::unspecified_t)
{
  *this = (long double) 0;
  t = sequence_type::unspecified_t;
}

sequence::~sequence()
{
  // todo: delete all sequence pointers created by sequence when adding strings (char and wchar)
  // todo: find a way to avoid the "new sequence" constructs used with strings...that is avoid strings!!!
  // using new inside sequence means that responsibility for sequence pointers cleanup is no longer user's solely,
  // thus sequence must know what to delete when calling destructor or "del", but even so, there is ambiguity because
  // sequence cannot know if user still needs a pointer...
}

// copy
sequence::sequence(sequence& e)
{
//  copy(e);
  *this = e;
}

sequence::sequence(const sequence& e)
{
//  sequence seq = e;
//  copy(seq);
  *this = e;
}

//sequence& sequence::operator=(sequence e)
//{
//  return copy(e);
//}

//sequence& sequence::operator=(sequence& e)
//{
//  return copy(e);
//}

sequence& sequence::operator=(const sequence& e)
{
  sequence seq = e;
  return copy(seq);
}

sequence& sequence::copy(sequence& e)
{
  t = e.t;
  elems.set(e.elems.get(), e.elems.size());
  subseqs.set(e.subseqs.get(), e.subseqs.size());
  
//  elems = e.elems;
//  subseqs = e.subseqs;
  
//  subseqs = e.subseqs;
//  if((long) e.elems.size() != 0)
//  {
//    elems.set(e.elems.get(), e.elems.size());
//  }
//  if((long) e.size() != 0)
//  {
//    subseqs = e.subseqs;
//  }
  return *this;
}

// type conversions
sequence::sequence(bool e)
{
  *this = e;
}

sequence::sequence(int e)
{
  *this = e;
}

sequence::sequence(long e)
{
  *this = e;
}

sequence::sequence(long long e)
{
  *this = e;
}

sequence::sequence(float e)
{
  *this = e;
}

sequence::sequence(double e)
{
  *this = e;
}

sequence::sequence(long double e)
{
  *this = e;
}

sequence::sequence(const char* e)
{
  *this = e;
}

sequence::sequence(char* e)
{
  *this = e;
}

sequence::sequence(Service* e)
{
  *this = e;
}

sequence::operator bool()
{
  return *(bool*) elems.get();
}

sequence::operator int()
{
  return *(int*) elems.get();
}

sequence::operator long()
{
  return *(long*) elems.get();
}

sequence::operator long long()
{
  return *(long long*) elems.get();
}

sequence::operator float()
{
//  return *(float*) elems.get();
  return *(long double*) elems.get();
}

sequence::operator double()
{
//  return *(double*) elems.get();
  return *(long double*) elems.get();
}

sequence::operator long double()
{
  return *(long double*) elems.get();
}

sequence::operator const char*()
{
  return (const char*) elems.get();
}

sequence::operator char*()
{
  return (char*) elems.get();
}

sequence::operator Service*()
{
  return (Service*) elems.get();
}

sequence& sequence::operator=(bool e)
{
  return *this = (long long) e;
}

sequence& sequence::operator=(int e)
{
  return *this = (long long) e;
}

sequence& sequence::operator=(long e)
{
  return *this = (long long) e;
}

sequence& sequence::operator=(long long e)
{
  elems.set(&e, sizeof(long long));
  t = sequence_type::integer_t;
  return *this;
}

sequence& sequence::operator=(float e)
{
  return *this = (long double) e;
}

sequence& sequence::operator=(double e)
{
  return *this = (long double) e;
}

sequence& sequence::operator=(long double e)
{
  elems.set(&e, sizeof(long double));
  t = sequence_type::floating_point_t;
  return *this;
}

sequence& sequence::operator=(const char* e)
{
  elems.set(e, strlen(e) + 1);
  t = sequence_type::string_ascii_t;
  return *this;
}

sequence& sequence::operator=(char* e)
{
  elems.set(e, strlen(e) + 1);
  t = sequence_type::string_ascii_t;
  return *this;
}

sequence& sequence::operator=(Service* e)
{
  elems.set(&e, sizeof(Object*));
  t = sequence_type::service_t;
  return *this;
}

// streamable interface
void sequence::read(StreamInput& si)
{
  // TODO avoid circular loops
  // TODO platform independent element (size and numbers/characters representations)
  Buffer sz;
  sz.resize(sizeof(long));
  
  // read elems buffer size
  si >> sz;
  elems.resize(*(long*) sz.get());
  // raw-read elems buffer
  si >> elems;
  // read number of sub-sequences
  si >> sz;
  resize(*(long*) sz.get());
//  subseqs.resize(*(long*) sz.get(), *new sequence((long double) 0));
  // read sub-sequences if any
  for(long i = 0; i < (long) size(); ++i)
  {
    // read sub-sequence
    si >> get(i);
  }
}

void sequence::write(StreamOutput& so)
{
  // TODO avoid circular loops
  // TODO platform independent element (size and numbers/characters representations)
  Buffer sz;
  long sizetmp = 0;
  
  // write elems buffer size
  sizetmp = elems.size();
  sz.set(&sizetmp, sizeof(long));
  so << sz;
  // raw-write elems buffer
  so << elems;
  // write number of sub-sequences
  sizetmp = (long) size();
  sz.set(&sizetmp, sizeof(long));
  so << sz;
  // write sub-sequences if any
  for(long i = 0; i < (long) size(); ++i)
  {
    // write sub-sequence
    so << get(i);
  }
}

// access
//sequence& sequence::get(const sequence& i)
sequence& sequence::get(sequence i)
{
  long ind = i;
  if(ind < 0)
  {
    throw 0;
  }
  else if((long) size() <= ind)
  {
//    debug("sequence::get oldsize = " << (long) size())
//    debug("sequence::get newsize = " << ind + 1)
    resize(ind + 1);
//    debug("sequence::get actsize = " << (long) size())
  }
//  return subseqs[ind];
//  sequence** ppseq = (sequence**) subseqs.get();
//  ppseq += ind * sizeof(sequence*);
//  return **ppseq;
  return **((sequence**) subseqs.get() + ind * sizeof(sequence*));
}

sequence& sequence::del(sequence& i)
{
//  subseqs.erase(subseqs.begin() + (long) i);
//  long ind = i;
  if((long) i < 0 || (long) size() <= (long) i)
  {
    throw 0;
  }
  for(long ind = (long) i + 1; (long) i < ind < (long) size(); ++ind)
  {
    get(ind - 1) = get(ind);
  }
  resize((long) size() - 1);
  return *this;
}

//void sequence::resize(sequence& size)
void sequence::resize(sequence size)
{
//  debug("sequence::resize size = " << (long) size)
  long oldsize = (long) this->size();
//  debug("sequence::resize oldsize = " << (long) oldsize)
  if((long) size < oldsize)
  {
//    debug("sequence::resize shrinking size")
    for(long ind = oldsize; ind < (long) size; ++ind)
    {
      delete &get(ind);
    }
  }
  subseqs.resize((long) size * sizeof(sequence*));
//  debug("sequence::resize new subseqs buffer size = " << subseqs.size())
  if((long) size > oldsize)
  {
//    debug("sequence::resize subseqs buffer expanded -> allocating new sub-sequences")
    for(long ind = oldsize; ind < (long) size; ++ind)
    {
//      debug("sequence::resize allocating i = " << ind)
//      sequence** ppseq = (sequence**) subseqs.get();
//      ppseq += ind * sizeof(sequence*);
//      *ppseq = new sequence();
      *((sequence**) subseqs.get() + ind * sizeof(sequence*)) = new sequence();
    }
  }
//  subseqs.resize((long) size, *new sequence());
//  if((long) size > subseqs.capacity())
//  {
//    debug("sequence::resize capacity = " << subseqs.capacity())
//    debug("sequence::resize max size = " << subseqs.max_size())
//    return;
//  }
//  subseqs.resize((long) size, *new sequence((long double) 0));
}

sequence sequence::size()
{
  return (long long) subseqs.size() / sizeof(sequence*);
}

char* sequence::text()
{
  stringstream s;
  
  s << " [type: " << this->t << " - elements size: " << elems.size() << " - subsequences size: " << (long) size() << "] ";
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
    s << "[sub-sequence " << i << "]";
    s << get(i).text();
//    debug("[sub-sequence " << i << " -> OK!]")
//    debug(s.str().c_str())
  }

  return (char*) s.str().c_str();
}
