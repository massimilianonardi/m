#ifndef BOOT_H
#define	BOOT_H

#include "sequence.h"
#include "service.h"
#include "kernel.h"

class Boot: virtual public Service
{
  protected:
    Kernel* k;

  public:
    Boot(Kernel* k);
    ~Boot();

    Sequence f(number i, Sequence& params);
};

#endif	/* BOOT_H */
