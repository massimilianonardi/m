#ifndef IFACE_TWO_H
#define	IFACE_TWO_H

#include "sunaptos.h"

class iface_two: virtual public Service
{
public:
  
  virtual ~iface_two(){};
  
  sequence f(element i, sequence& params);
//  virtual sequence f(element i, sequence& params);
//  virtual sequence f(element i, sequence& params)
//  {
//    debug("[iface_two::f] i = " << (long) i << " - params = " << (char*) params)
//    sequence res;
//    switch((long) i)
//    {
//      case 0:
//        res = m_two_1(params);
//        break;
//
//      case 1:
//        res = m_two_2(params);
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
  
  iface_two* iface_two_i()
  {
    return this;
  }

  virtual sequence m_two_1(sequence& params) = 0;
  virtual sequence m_two_2(sequence& params) = 0;

  iface_two* operator()(Service* srv)
  {
    return reinterpret_cast<iface_two*>(srv);
  }
};
  
#endif	/* IFACE_TWO_H */
