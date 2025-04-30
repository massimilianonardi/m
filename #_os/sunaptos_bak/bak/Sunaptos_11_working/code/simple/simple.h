#ifndef SIMPLE_H
#define	SIMPLE_H

#include "sequence.h"
#include "service.h"
#include "kernel.h"

class Simple: virtual public Service
{
  public:
    Simple(Kernel* k);
    ~Simple();

    Sequence f(number i, Sequence& params);
};

#endif	/* SIMPLE_H */
