#ifndef SIMPLE_H
#define	SIMPLE_H

#include "sunaptos.h"

class Simple: virtual public Service
{
  public:
    Simple(Service* k);
    ~Simple();

    sequence f(element i, sequence& params);
};

#endif	/* SIMPLE_H */
