#ifndef SIMPLE_H
#define	SIMPLE_H

#include "sunaptos.h"

class Simple: virtual public Service
{
  public:
    Simple(Service* k);
    ~Simple();

    Sequence f(const Sequence& i, const Sequence& params);
    inline Sequence test1(const Sequence& params){debug("invoking_test1") return "test1\n";};
    inline Sequence test2(const Sequence& params){debug("invoking_test2") return "test2\n";};
//    enum: long
//    {
//      method_01 = (void*) &Simple::test1,
//      method_02 = (void*) &Simple::test2
//    };
};

#endif	/* SIMPLE_H */
