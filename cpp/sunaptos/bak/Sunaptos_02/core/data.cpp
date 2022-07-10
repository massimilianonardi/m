#include "data.h"

Data::Data(int type, unsigned long size, void* buf)
{
  // todo: check if buf-size is actually == to size
  this->t = type;
  this->s = size;
  this->b = buf;
}

Data::~Data()
{
}

int Data::type()
{
  return t;
}

unsigned long Data::size()
{
  return s;
}

const void* Data::buf()
{
  return (const void*) b;
}

long Data::l() throw (const char*)
{
  if(t == tl)
  {
    return (long) *((long*) b);
  }
  else
  {
    throw "Data::l() throw (const char*)...Wrong data type!";
  }
}

char* Data::c() throw (const char*)
{
  if(t == tc)
  {
    return (char*) b;
  }
  else
  {
    throw "Data::c() throw (const char*)...Wrong data type!";
  }
}

void* Data::v() throw (const char*)
{
  if(t == tv)
  {
    return (void*) b;
  }
  else
  {
    throw "Data::v() throw (const char*)...Wrong data type!";
  }
}
