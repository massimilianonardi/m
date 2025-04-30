#include "sequence.h"
#include <stdlib.h>
#include <string.h>
#include <string>
#include <iostream>

// todo: replace the issequence implementation with a faster one avoididng the usage of set and singleton
// the fastest way would be to have a char* buffer to store true/false values, but having the put/add methods 
// as template methods, brings the same problem of how can i know if i am putting a value or a pointer...
// maybe defining two redundant template methods (put/add) based on T* instead of T should do the trick...
// verify!
#include "singleton.h"
#include <set>
typedef Singleton<std::set<Sequence*> > seqmap;

bool issequence(void* p)
{
  return seqmap::instance().find(reinterpret_cast<Sequence*>(p)) != seqmap::instance().end();
}

void mapsequence(Sequence* seq)
{
  seqmap::instance().insert(seq);
}

void unmapsequence(Sequence* seq)
{
  seqmap::instance().erase(seq);
}

Sequence::Sequence(): pb(0), sz(0), wd(sizeof(number))
{
  mapsequence(this);
}

Sequence::Sequence(const Sequence& seq)
{
  *this = seq;
  mapsequence(this);
}

Sequence::Sequence(number width): pb(0), sz(0), wd(width)
{
  mapsequence(this);
}

Sequence::Sequence(const char* e)
{
  *this = e;
  mapsequence(this);
}

Sequence::Sequence(const wchar_t* e)
{
  *this = e;
  mapsequence(this);
}

Sequence::~Sequence()
{
  unmapsequence(this);
  free(pb);
}

void Sequence::read(StreamInput* si)
{
  Buffer b;

  b.sz = sizeof(number);
  // read width
  si->read(&b);
  wd = *(number*) b.pb;
  // read size
  si->read(&b);
  sz = *(number*) b.pb;
  // resize
  resize(sz);
  // raw-read
  b.sz = wd * sz;
  si->read(&b);
  memcpy(pb, b.pb, b.sz);
  // read sub-sequences and replace sender pointer read with previous raw copy with newly created pointers
  // read number of sub-sequences to read
  b.sz = sizeof(number);
  si->read(&b);
  number nseq = *(number*) b.pb;
  // read each sub-sequence
  for(number i = 0; i < nseq; i++)
  {
    // read index value
    si->read(&b);
    number iseq = *(number*) b.pb;
    // create sub-sequence
    Sequence* seq = new Sequence();
    seq->read(si);
    // put sub-sequence at correct index (replacing bad addresses read with raw-read)
    set<Sequence*>(seq, iseq);
  }
}

void Sequence::write(StreamOutput* so)
{
  Buffer b;

  b.sz = sizeof(number);
  // write width
  b.pb = &wd;
  so->write(&b);
  // write size
  b.pb = &sz;
  so->write(&b);
  // raw-write
  b.sz = wd * sz;
  b.pb = pb;
  so->write(&b);
  // todo: improve performance avoiding the double loop IF StreamOutput allow positioning
  // write sub-sequences if any
  // count sub-sequences
  number nseq = 0;
  for(number i = 0; i < sz; i++)
  {
//    Sequence* seq = dynamic_cast<Sequence*>(get<Streamable*>(i));
    Sequence* seq = get<Sequence*>(i);
    if(issequence(seq))
    {
      nseq++;
    }
  }
  // write number of sub-sequences
  b.sz = sizeof(number);
  b.pb = &nseq;
  so->write(&b);
  for(number i = 0; i < sz; i++)
  {
    Sequence* seq = get<Sequence*>(i);
    if(issequence(seq))
    {
      // write index where to put
      b.pb = &i;
      so->write(&b);
      // write sub-sequence
      seq->write(so);
    }
  }
}

number Sequence::width()
{
  return wd;
}

number Sequence::size()
{
  return sz;
}

void Sequence::resize(number size)
{
  // todo: check size for consistency and avoid malicious usage like stack overflow etc.
//  sz = 0;
  pb = (char*) realloc(pb, wd * size);
//  pb = new char[(long) size * wd];
  sz = size;
}

Sequence& Sequence::operator=(const Sequence& seq)
{
  if(&seq == this)
  {
    return *this;
  }
  else
  {
    wd = seq.wd;
    resize(seq.sz);
    memcpy(pb, seq.pb, seq.sz);

    return *this;
  }
}

Sequence& Sequence::operator=(const char* e)
{
  std::string s = e;
  copy(s.c_str(), s.size() + 1);
  return *this;
}

Sequence& Sequence::operator=(const wchar_t* e)
{
  std::wstring s = e;
  copy(s.c_str(), s.size() + 1);
  return *this;
}

Sequence& Sequence::operator<<(const char* e)
{
  std::string s = e;
  Sequence* seq = new Sequence();
  seq->copy(s.c_str(), s.size() + 1);
  return add<Sequence*>(seq);
}

Sequence& Sequence::operator<<(const wchar_t* e)
{
  std::wstring s = e;
  Sequence* seq = new Sequence();
  seq->copy(s.c_str(), s.size() + 1);
  return add<Sequence*>(seq);
}
