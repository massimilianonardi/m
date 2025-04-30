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
  
  virtual Sequence f(number i, Sequence& params);
  
  Sequence _m_one_1(Sequence& params)
  {
    debug("[Simple::m_one_1]")
    Sequence res;
    return res;
  }
  
  Sequence _m_one_2(Sequence& params)
  {
    debug("[Simple::m_one_2]")
    Sequence res;
    return res;
  }
  
  Sequence m_two_1(Sequence& params)
  {
    debug("[Simple::m_two_1]")
    Sequence res;
    return res;
  }
  
  Sequence m_two_2(Sequence& params)
  {
    debug("[Simple::m_two_2]")
    Sequence res;
    return res;
  }

//    Sequence f(number i, Sequence& params);
};

#endif	/* SIMPLE_H */
