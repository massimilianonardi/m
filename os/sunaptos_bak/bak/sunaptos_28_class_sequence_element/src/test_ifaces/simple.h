#ifndef SIMPLE_H
#define	SIMPLE_H

#include "sunaptos.h"
#include "iface_one.h"
#include "iface_two.h"

//class Simple: virtual public Service, virtual public iface_one, virtual public iface_two
class Simple: public iface_one, public iface_two
{
  public:
    Simple(Service* k);
    ~Simple();
  
  virtual sequence f(element i, sequence& params);
  
  sequence _m_one_1(sequence& params)
  {
    debug("[Simple::m_one_1]")
    sequence res;
    return res;
  }
  
  sequence _m_one_2(sequence& params)
  {
    debug("[Simple::m_one_2]")
    sequence res;
    return res;
  }
  
  sequence m_two_1(sequence& params)
  {
    debug("[Simple::m_two_1]")
    sequence res;
    return res;
  }
  
  sequence m_two_2(sequence& params)
  {
    debug("[Simple::m_two_2]")
    sequence res;
    return res;
  }

//    sequence f(element i, sequence& params);
};

#endif	/* SIMPLE_H */
