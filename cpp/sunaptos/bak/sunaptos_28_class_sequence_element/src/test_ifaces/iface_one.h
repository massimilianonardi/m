#ifndef IFACE_ONE_H
#define	IFACE_ONE_H

#include "sunaptos.h"

class iface_one: virtual public Service
{
public:
  
  virtual ~iface_one(){};
  
  sequence f(element i, sequence& params);
//  virtual sequence f(element i, sequence& params);
//  sequence f(element i, sequence& params)
//  {
//    debug("[iface_one::f] i = " << (long) i << " - params = " << (char*) params)
//    sequence res;
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
//        sequence e;
//        e << i;
//        e << new sequence(params);
//        throw e;
//        break;
//    return res;
//  }
  
  iface_one* iface_one_i()
  {
    return this;
  }
  
  virtual sequence m_one_1(sequence& params)
  {
    f(0, params);
  }
  
  virtual sequence m_one_2(sequence& params)
  {
    f(1, params);
  }

private:
  virtual sequence _m_one_1(sequence& params) = 0;
  virtual sequence _m_one_2(sequence& params) = 0;

  iface_one* operator()(Service* srv)
  {
    return reinterpret_cast<iface_one*>(srv);
  }
};

#endif	/* IFACE_ONE_H */
