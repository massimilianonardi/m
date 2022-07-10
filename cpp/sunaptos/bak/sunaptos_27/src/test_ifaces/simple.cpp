#include "simple.h"

Simple::Simple(Service* k)
{
  debug("[Simple::tifs]")
}

Simple::~Simple()
{
  debug("[Simple::~tifs]")
}

sequence Simple::f(element i, sequence& params)
{
  debug("[Simple::f]")
  debug("[Simple::f] i = " << (long) i << " - params = " << (char*) params)
  sequence res;
  return res;
}

sequence iface_one::f(element i, sequence& params)
{
  debug("[iface_one::f] i = " << (long) i << " - params = " << (char*) params)
  sequence res;
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
      sequence e;
      e << i;
      e << new sequence(params);
      throw e;
      break;
  }
  return res;
}

sequence iface_two::f(element i, sequence& params)
{
  debug("[iface_two::f] i = " << (long) i << " - params = " << (char*) params)
  sequence res;
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
      sequence e;
      e << i;
      e << new sequence(params);
      throw e;
      break;
  }
  return res;
}
