#include "sequence.h"

Sequence::Sequence(): t(Sequence_type::unspecified_t)
{
  *this = (long double) 0;
  t = Sequence_type::unspecified_t;
}

Sequence::~Sequence()
{
  // todo: delete all Sequence pointers created by Sequence when adding strings (char and wchar)
  // todo: find a way to avoid the "new Sequence" constructs used with strings...that is avoid strings!!!
  // using new inside Sequence means that responsibility for Sequence pointers cleanup is no longer user's solely,
  // thus Sequence must know what to delete when calling destructor or "del", but even so, there is ambiguity because
  // Sequence cannot know if user still needs a pointer...
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
//  Sequence seq = e;
//  return copy(seq);
  return copy(e);
}

//Sequence& Sequence::copy(Sequence& e)
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

Sequence::operator bool()
{
  return *(bool*) elems.get();
}

Sequence::operator int()
{
  return *(int*) elems.get();
}

Sequence::operator long()
{
  return *(long*) elems.get();
}

Sequence::operator long long()
{
  return *(long long*) elems.get();
}

Sequence::operator float()
{
//  return *(float*) elems.get();
  return *(long double*) elems.get();
}

Sequence::operator double()
{
//  return *(double*) elems.get();
  return *(long double*) elems.get();
}

Sequence::operator long double()
{
  return *(long double*) elems.get();
}

Sequence::operator const char*()
{
  return (const char*) elems.get();
}

Sequence::operator char*()
{
  return (char*) elems.get();
}

Sequence::operator Service*()
{
  return *(Service**) elems.get();
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

Sequence& Sequence::operator=(Service* e)
{
  elems.set(&e, sizeof(Object*));
//  elems.set(&e, sizeof(Service*));
//  elems.set(&e, sizeof(void*));
//  elems.set(&e, sizeof(long));
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
  
  // read elems buffer size
  si >> sz;
  elems.resize(*(long*) sz.get());
  // raw-read elems buffer
  si >> elems;
  // read number of sub-Sequences
  si >> sz;
  resize(*(long*) sz.get());
//  subseqs.resize(*(long*) sz.get(), *new Sequence((long double) 0));
  // read sub-Sequences if any
  for(long i = 0; i < (long) size(); ++i)
  {
    // read sub-Sequence
    si >> get(i);
  }
}

void Sequence::write(StreamOutput& so)
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
long Sequence::size()
{
  return (long long) subseqs.size() / sizeof(Sequence*);
}

Sequence_type Sequence::type()
{
  return t;
}

char* Sequence::text()
{
  stringstream s;
  
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

//// todo: replace the issequence implementation with a faster one avoididng the usage of set and singleton
//// the fastest way would be to have a char* buffer to store true/false values, but having the put/add methods 
//// as template methods, brings the same problem of how can i know if i am putting a value or a pointer...
//// maybe defining two redundant template methods (put/add) based on T* instead of T should do the trick...
//// verify!
//typedef Singleton<std::set<Sequence*> > seqmap;
//
//bool issequence(void* p)
//{
//  return seqmap::i().find(reinterpret_cast<Sequence*>(p)) != seqmap::i().end();
//}
//
//void mapsequence(Sequence* seq)
//{
//  seqmap::i().insert(seq);
//}
//
//void unmapsequence(Sequence* seq)
//{
//  seqmap::i().erase(seq);
//}
//
////------------------------------------------------------------------------------
//
//Sequence::Sequence(): pb(0), sz(0), wd(sizeof(number))
//{
//  mapsequence(this);
//}
//
//Sequence::Sequence(const Sequence& seq): pb(0), sz(0)
//{
////  std::cout << "\n[Sequence::Sequence(const Sequence& seq)]\n";
//  *this = seq;
//  mapsequence(this);
//}
//
//Sequence::Sequence(number width): pb(0), sz(0), wd(width)
//{
//  mapsequence(this);
//}
//
//Sequence::Sequence(const char* e): pb(0), sz(0)
//{
//  *this = e;
//  mapsequence(this);
//}
//
//Sequence::Sequence(const wchar_t* e): pb(0), sz(0)
//{
//  *this = e;
//  mapsequence(this);
//}
//
//Sequence::~Sequence()
//{
//  // todo: delete all sequence pointers created by sequence when adding strings (char and wchar)
//  // todo: find a way to avoid the "new sequence" constructs used with strings...that is avoid strings!!!
//  // using new inside sequence means that responsibility for sequence pointers cleanup is no longer user's solely,
//  // thus sequence must know what to delete when calling destructor or "del", but even so, there is ambiguity because
//  // sequence cannot know if user still needs a pointer...
//  unmapsequence(this);
//  free(pb);
//}
////
////void Sequence::read(StreamInput& si)
////{
////  Buffer b;
////
////  b.sz = sizeof(number);
////  // read width
////  si.read(b);
////  wd = *(number*) b.pb;
////  // read size
////  si.read(b);
////  sz = *(number*) b.pb;
////  // resize
////  resize(sz);
////  // raw-read
////  b.sz = wd * sz;
////  si.read(b);
////  memcpy(pb, b.pb, b.sz);
////  // read sub-sequences and replace sender pointer read with previous raw copy with newly created pointers
////  // read number of sub-sequences to read
////  b.sz = sizeof(number);
////  si.read(b);
////  number nseq = *(number*) b.pb;
////  // read each sub-sequence
////  for(number i = 0; i < nseq; i++)
////  {
////    // read index value
////    si.read(b);
////    number iseq = *(number*) b.pb;
////    // create sub-sequence
////    Sequence* seq = new Sequence();
////    seq->read(si);
////    // put sub-sequence at correct index (replacing bad addresses read with raw-read)
////    set<Sequence*>(seq, iseq);
////  }
////}
////
////void Sequence::write(StreamOutput& so)
////{
////  Buffer b;
////
////  b.sz = sizeof(number);
////  // write width
////  b.pb = &wd;
////  so.write(b);
////  // write size
////  b.pb = &sz;
////  so.write(b);
////  // raw-write
////  b.sz = wd * sz;
////  b.pb = pb;
////  so.write(b);
////  // todo: improve performance avoiding the double loop IF StreamOutput allow positioning
////  // write sub-sequences if any
////  // count sub-sequences
////  number nseq = 0;
////  for(number i = 0; i < sz; i++)
////  {
//////    Sequence* seq = dynamic_cast<Sequence*>(get<Streamable*>(i));
////    Sequence* seq = get<Sequence*>(i);
////    if(issequence(seq))
////    {
////      nseq++;
////    }
////  }
////  // write number of sub-sequences
////  b.sz = sizeof(number);
////  b.pb = &nseq;
////  so.write(b);
////  for(number i = 0; i < sz; i++)
////  {
////    Sequence* seq = get<Sequence*>(i);
////    if(issequence(seq))
////    {
////      // write index where to put
////      b.pb = &i;
////      so.write(b);
////      // write sub-sequence
////      seq->write(so);
////    }
////  }
////}
//
//void Sequence::read(StreamInput& si)
//{
//  Buffer b;
//
//  si >> wd;
//  si >> sz;
//  // resize
//  resize(sz);
//  // raw-read
//  b.resize(wd * sz);
//  si >> b;
//  memcpy(pb, b.get(), b.size());
//  // read sub-sequences and replace sender pointer read with previous raw copy with newly created pointers
//  // read number of sub-sequences to read
//  number nseq = 0;
//  si >> nseq;
//  // read each sub-sequence
//  for(number i = 0; i < nseq; i++)
//  {
//    // read index value
//    number iseq = 0;
//    si >> iseq;
//    // create sub-sequence
//    Sequence* seq = new Sequence();
//    si >> *seq;
//    // put sub-sequence at correct index (replacing bad addresses read with raw-read)
//    set<Sequence*>(seq, iseq);
//  }
//}
//
//void Sequence::write(StreamOutput& so)
//{
//  Buffer b;
//
//  so << wd;
//  so << sz;
//  // raw-write
//  b.set(pb, wd * sz);
//  so << b;
//  // todo: improve performance avoiding the double loop IF StreamOutput allow positioning
//  // write sub-sequences if any
//  // count sub-sequences
//  number nseq = 0;
//  for(number i = 0; i < sz; i++)
//  {
////    Sequence* seq = dynamic_cast<Sequence*>(get<Streamable*>(i));
//    Sequence* seq = get<Sequence*>(i);
//    if(issequence(seq))
//    {
//      nseq++;
//    }
//  }
//  // write number of sub-sequences
//  so << nseq;
//  for(number i = 0; i < sz; i++)
//  {
//    Sequence* seq = get<Sequence*>(i);
//    if(issequence(seq))
//    {
//      // write index where to put
//      so << i;
//      // write sub-sequence
//      so << *seq;
//    }
//  }
//}
//
//number Sequence::width()
//{
//  return wd;
//}
//
//number Sequence::size()
//{
//  return sz;
//}
//
//void Sequence::resize(number size)
//{
//  // todo: check size for consistency and avoid malicious usage like stack overflow etc.
////  sz = 0;
//  pb = (char*) realloc(pb, wd * size);
////  pb = new char[(long) size * wd];
//  sz = size;
//}
//
//char* Sequence::text()
//{
//  stringstream s;
//  
//  s << "[" << (char*) *this << "]\n";
//
//  for(number i = 0; i < sz; i++)
//  {
//    Sequence* seq = get<Sequence*>(i);
//    if(issequence(seq))
//    {
//      s << "[" << (char*) *seq << "]\n";
//      s << "[\n" << seq->text() << "]\n";
//    }
//    else
//    {
//      s << (long long) get<number>(i);
//    }
//    s << "\n";
//  }
//  return (char*) s.str().c_str();
//}
//
//Sequence::operator Service*()
//{
////  return reinterpret_cast<Service*>((long) ((*this)[0]));
//  return reinterpret_cast<Service*>((long) this->get<long>(0));
//}
//
//Sequence& Sequence::operator()(number i)
//{
//  return *get<Sequence*>(i);
//}
//
//number& Sequence::operator[](number i)
//{
//  return get<number>(i);
//}
//
//number& Sequence::operator[](int i)
//{
//  return get<number>(i);
//}
//
//Sequence& Sequence::operator<<(number e)
//{
//  return ins<number>(e);
//}
//
//Sequence& Sequence::operator<<(Sequence* e)
//{
//  return ins<Sequence*>(e);
//}
//
//Sequence& Sequence::operator<<(const char* e)
//{
//  std::string s = e;
//  Sequence* seq = new Sequence();
//  seq->copy(s.c_str(), s.size() + 1);
//  return ins<Sequence*>(seq);
//}
//
//Sequence& Sequence::operator<<(const wchar_t* e)
//{
//  std::wstring s = e;
//  Sequence* seq = new Sequence();
//  seq->copy(s.c_str(), s.size() + 1);
//  return ins<Sequence*>(seq);
//}
//
//Sequence& Sequence::operator=(const Sequence& seq)
//{
////  std::cout << "\n[Sequence::operator= 00]\n";
//  if(&seq == this)
//  {
////    std::cout << "\n[Sequence::operator= 01]\n";
//    return *this;
//  }
//  else
//  {
//    // todo: make a copy of the full serialization!!! otherwise the copy and copy contructor are unsafe!
////    std::cout << "\n[Sequence::operator= 02]\n";
//    wd = seq.wd;
//    resize(seq.sz);
//    memcpy(pb, seq.pb, seq.sz * seq.wd);
////    if(seq.sz > 0)
////    std::cout << "\n[Sequence::operator= 03]\n" << wd << " " << sz << " " << pb << " " << *((number*) seq.pb) << " " << *((number*) pb) << "\n";
//
//    return *this;
//  }
//}
//
//Sequence& Sequence::operator=(number e)
//{
//  resize(1);
//  this->get<number>(0) = e;
//  return *this;
//}
//
//Sequence& Sequence::operator=(const char* e)
//{
//  std::string s = e;
//  copy(s.c_str(), s.size() + 1);
//  return *this;
//}
//
//Sequence& Sequence::operator=(const wchar_t* e)
//{
//  std::wstring s = e;
//  copy(s.c_str(), s.size() + 1);
//  return *this;
//}
