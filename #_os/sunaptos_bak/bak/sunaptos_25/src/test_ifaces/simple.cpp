#include "simple.h"

Simple::Simple(Service* k)
{
  debug("[Simple::tifs]")
}

Simple::~Simple()
{
  debug("[Simple::~tifs]")
}

Sequence Simple::f(number i, Sequence& params)
{
  debug("[Simple::f]")
  debug("[Simple::f] i = " << (long) i << " - params = " << (char*) params)
  Sequence res;
  return res;
}

Sequence iface_one::f(number i, Sequence& params)
{
  debug("[iface_one::f] i = " << (long) i << " - params = " << (char*) params)
  Sequence res;
  switch((long) i)
  {
    case 0:
      res = m_one_1(params);
      break;

    case 1:
      res = m_one_2(params);
      break;

    default:
      debug("[Kernel::f 01]")
      Sequence e;
      e << i;
      e << new Sequence(params);
      throw e;
      break;
  }
  return res;
}

Sequence iface_two::f(number i, Sequence& params)
{
  debug("[iface_two::f] i = " << (long) i << " - params = " << (char*) params)
  Sequence res;
  switch((long) i)
  {
    case 0:
      res = m_two_1(params);
      break;

    case 1:
      res = m_two_2(params);
      break;

    default:
      debug("[Kernel::f 01]")
      Sequence e;
      e << i;
      e << new Sequence(params);
      throw e;
      break;
  }
  return res;
}
