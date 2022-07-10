#include "simple.h"

Simple::Simple(Service* k)
{
  debug("[Simple::Simple]")
}

Simple::~Simple()
{
  debug("[Simple::~Simple]")
}

Sequence Simple::f(number i, Sequence& params)
{
  debug("[Simple::f]")
  debug("[Simple::f] i = " << (long) i << " - params = " << (char*) params)
  Sequence res;
  return res;
}
