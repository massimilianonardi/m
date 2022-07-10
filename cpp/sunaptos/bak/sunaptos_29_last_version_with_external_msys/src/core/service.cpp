#include "sunaptos.h"

sequence& Service::f(sequence& i, sequence& params, sequence& res)
{
  res = f(&i, &params);
  return res;
}

sequence Service::f(sequence i, sequence params)
{
  return f(&i, &params);
}
