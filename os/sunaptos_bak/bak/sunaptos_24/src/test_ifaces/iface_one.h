#ifndef IFACE_ONE_H
#define	IFACE_ONE_H

#include "sunaptos.h"

class iface_one: virtual public Service
{
public:
  
  virtual ~iface_one(){};
  
  Sequence f(number i, Sequence& params);
//  virtual Sequence f(number i, Sequence& params);
//  Sequence f(number i, Sequence& params)
//  {
//    debug("[iface_one::f] i = " << (long) i << " - params = " << (char*) params)
//    Sequence res;
//    switch((long) i)
//    {
//      case 0:
//        res = m_one_1(params);
//        break;
//
//      case 1:
//        res = m_one_2(params);
//        break;
//
//      default:
//        debug("[Kernel::f 01]")
//        Sequence e;
//        e << i;
//        e << new Sequence(params);
//        throw e;
//        break;
//    return res;
//  }
  
  iface_one* iface_one_i()
  {
    return this;
  }
  
  virtual Sequence m_one_1(Sequence& params)
  {
    f(0, params);
  }
  
  virtual Sequence m_one_2(Sequence& params)
  {
    f(1, params);
  }

private:
  virtual Sequence _m_one_1(Sequence& params) = 0;
  virtual Sequence _m_one_2(Sequence& params) = 0;

  iface_one* operator()(Service* srv)
  {
    return reinterpret_cast<iface_one*>(srv);
  }
};

#endif	/* IFACE_ONE_H */
