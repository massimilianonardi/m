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

    Sequence f(const Sequence& i, const Sequence& params);

  protected:
    Sequence createSeparate(const Sequence& params);
    Sequence createRemote(const Sequence& params);
    Sequence notifyStartup(const Sequence& params);
};

#endif	/* KERNELMASTER_H */
