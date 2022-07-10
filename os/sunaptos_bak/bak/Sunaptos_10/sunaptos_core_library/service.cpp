#include "service.h"

Sequence Service::f(number i, Sequence& params)
{
  Sequence res;
  return f(i, params, res);
}
