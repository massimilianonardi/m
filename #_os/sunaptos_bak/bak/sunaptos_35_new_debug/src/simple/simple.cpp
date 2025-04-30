#include "simple.h"
#include "_sequence.h"

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
//  sequence seq;
//  seq = sequence();
//  seq = sequence(6);
//  seq = sequence("test very long phrase to see how much is size");
//  element e = 8;
//  e = 5;
//  e.l = 7;
//  e.t = element::integer_t;
//  seq.ins(e);
//  seq.ins(3);
//  seq.ins((element) 4);
//  seq.ins((element) 5).ins(6);
//  seq.ins(&seq);
//  seq.text();
//  debug("[Simple::f] seq.text() = " << seq.text())
//  seq << e;
//  seq[(element) 0] = 5;
//  seq << 5;
//  seq << e;
//  seq << (element) 5;
  
  Sequence res;
  return res;
}
