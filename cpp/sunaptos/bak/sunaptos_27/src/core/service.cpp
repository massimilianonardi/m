#include "sunaptos.h"

sequence& Service::f(element i, sequence& params, sequence& res)
{
  res = f(i, params);
  return res;
}
