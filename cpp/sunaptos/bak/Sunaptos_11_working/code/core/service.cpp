#include "service.h"

Sequence& Service::f(number i, Sequence& params, Sequence& res)
{
  res = f(i, params);
  return res;
}
