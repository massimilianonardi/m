#include "sequence.h"
#include <stdlib.h>
#include <string.h>

Sequence::Sequence(): pb(0), sz(0), wd(1)
{
}

Sequence::Sequence(const Sequence& seq)
{
  *this = seq;
}

Sequence::Sequence(number width): pb(0), sz(0), wd(width)
{
}

Sequence::~Sequence()
{
  free(pb);
}

void Sequence::read(StreamInput* si)
{
  Buffer b;

  sz = 0;
  b.sz = sizeof(number);
  si->read(&b);
  wd = *(number*) b.pb;
  si->read(&b);
  number len = *(number*) b.pb;
  // todo: check len for consistency and avoid malicious usage like stack overflow etc.
  resize(len);

  if(0 < wd)
  {
    b.sz = len;
    si->read(&b);
    memcpy(pb, b.pb, b.sz);
  }
  else
  {
    for(number i = 0; i < sz; i++)
    {
      Sequence* seq = new Sequence();
      seq->read(si);
      void* pi = (*this)(i);
      pi = dynamic_cast<void*>(seq);
    }
  }
}

void Sequence::write(StreamOutput* so)
{
  Buffer b;

  b.sz = sizeof(number);
  b.pb = &wd;
  so->write(&b);
  b.pb = &sz;
  so->write(&b);

  if(0 < wd)
  {
    b.sz = sz * wd;
    b.pb = pb;
    so->write(&b);
  }
  else
  {
    for(number i = 0; i < sz; i++)
    {
      void* pi = (*this)(i);
      Sequence* seq = reinterpret_cast<Sequence*>(pi);
      if(seq == 0)
      {
        throw 0;
      }
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
  pb = realloc(pb, size * wd);
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

//void* Sequence::operator()(number i)
//{
//  if(i < 0 || sz <= i)
//  {
//    throw 0;
//  }
//
//  return (void*) ((char*) pb + (long) (wd * i));
//}
