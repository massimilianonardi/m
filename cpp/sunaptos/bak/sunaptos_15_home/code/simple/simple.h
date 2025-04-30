#ifndef SIMPLE_H
#define	SIMPLE_H

#include "sunaptos.h"

class Simple: virtual public Service
{
  public:
    Simple(Service* k);
    ~Simple();

    Sequence f(number i, Sequence& params);
};

#endif	/* SIMPLE_H */
