#ifndef KERNELMASTER_H
#define	KERNELMASTER_H

#include "sunaptos.h"

typedef map<string, Lock*> LockMap;

class KernelMaster: virtual public Service
{
  protected:
    LockMap lm;

  public:
//    enum {create_separate = 0}; // use enum from Kernel...

    KernelMaster(Service* k);
    ~KernelMaster();

    Sequence f(number i, Sequence& params);

  protected:
    Sequence createSeparate(Sequence& params);
    Sequence createRemote(Sequence& params);
    Sequence notifyStartup(Sequence& params);
};

#endif	/* KERNELMASTER_H */
