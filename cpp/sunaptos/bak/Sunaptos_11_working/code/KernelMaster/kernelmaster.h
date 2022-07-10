#ifndef KERNELMASTER_H
#define	KERNELMASTER_H

#include "sequence.h"
#include "service.h"
#include "kernel.h"

class KernelMaster: virtual public Service
{
  public:
//    enum {create_separate = 0}; // use enum from Kernel...

    KernelMaster(Kernel* k);
    ~KernelMaster();

    Sequence f(number i, Sequence& params);
};

#endif	/* KERNELMASTER_H */
