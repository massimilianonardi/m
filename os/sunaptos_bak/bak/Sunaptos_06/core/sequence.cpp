#include "sequence.h"
#include <stdlib.h>
#include <string.h>

Sequence::Sequence(): pb(0), sz(0)
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
  number len = *(number*) b.pb;

  b.sz = len;
  // todo: check len for consistency and avoid malicious usage like stack overflow etc.
  si->read(&b);
//  pb = b.pb;
  memcpy(pb, b.pb, b.sz);
  sz = len;
}

void Sequence::write(StreamOutput* so)
{
  Buffer b;

  b.sz = sizeof(number);
  b.pb = &sz;
  so->write(&b);

  b.sz = sz;
  b.pb = pb;
  so->write(&b);
}

number Sequence::size()
{
  return sz;
}

void Sequence::resize(number size)
{
//  sz = 0;
  pb = realloc(pb, size);
//  pb = new char[(long) size];
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
    resize(seq.sz);
    memcpy(pb, seq.pb, seq.sz);
    sz = seq.sz;

    return *this;
  }
}
