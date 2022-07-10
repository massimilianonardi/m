#include "simple.h"

Simple::Simple(Service* k)
{
  debug("[Simple::Simple]")
}

Simple::~Simple()
{
  debug("[Simple::~Simple]")
}

SERVICE_METHOD_DISPATCHER(Simple)
//Sequence Simple::f(const Sequence& i, const Sequence& params)
//{
  debug("[Simple::f]")
//  debug("[Simple::f] i = " << (long) i << " - params = " << (char*) i << " - params = " << (char*) params)
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
//  ServiceMethod sm1 = &Simple::test1;
//  ServiceMethod sm2 = &Simple::test2;
//  SERVICE_METHOD_TYPE(Simple, SimpleMethodType)
//  SimpleMethodType sm1 = &Simple::test1;
//  SimpleMethodType sm2 = &Simple::test2;
//  Sequence s1 = "test1";
//  Sequence s2 = "test2";
//  Sequence method = i;
  SERVICE_REGISTER_METHOD_BY_NAME(test1)
  SERVICE_REGISTER_METHOD_BY_NAME(test2)
//  if(i == Sequence("test1"))
//  {
//    debug("test1 OK")
//    return test1(params);
//  }
//  else if(i == Sequence("test2"))
//  {
//    debug("test2 OK")
//    return test2(params);
//  }
//  if(i == s1)
//  {
//    debug("test1 bis OK")
//    return test1(params);
//  }
//  else if(i == s2)
//  {
//    debug("test2 bis OK")
//    return test2(params);
//  }
//  if(Sequence(i) == s1)
//  {
//    debug("test1 bis OK")
//    return test1(params);
//  }
//  else if(Sequence(i) == s2)
//  {
//    debug("test2 bis OK")
//    return test2(params);
//  }
//  if(strcmp(i, "test1"))
//  {
//    debug("test1 tris OK")
//    return test1(params);
//  }
//  else if(strcmp(i, "test2"))
//  {
//    debug("test2 tris OK")
//    return test2(params);
//  }
  else
  {
    debug("test ERROR")
    return "error!!!\n";
  }
  
  Sequence res;
  return res;
//}
SERVICE_METHOD_DISPATCHER_END
