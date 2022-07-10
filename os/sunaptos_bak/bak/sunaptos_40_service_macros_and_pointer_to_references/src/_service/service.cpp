#include "service.h"

#include "exception.h"
#include "debug.h"

Sequence& Service::f(Sequence& method, Sequence& params, Sequence& res)
{
  res = f(method, params);
  return res;
}

//Sequence Service::f2(const Sequence& i, Sequence& params)
//{
//  exception_try
//  debug_line
//  Sequence i2 = i;
//  return f(i2, params);
//  debug_line
//  exception_catch
//  exception_end
//}
