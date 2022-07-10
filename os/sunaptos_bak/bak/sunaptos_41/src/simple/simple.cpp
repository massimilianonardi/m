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
  SERVICE_REGISTER_METHOD_BY_NAME(test1)
  SERVICE_REGISTER_METHOD_BY_NAME(test2)
//  else
//  {
//    debug("test ERROR")
//    return "error!!!\n";
//  }
//  
//  Sequence res;
//  return res;
//}
SERVICE_METHOD_DISPATCHER_END
