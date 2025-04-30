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

    sequence f(sequence& i, sequence& params);

  protected:
    sequence createSeparate(sequence& params);
    sequence createRemote(sequence& params);
    sequence notifyStartup(sequence& params);
};

#endif	/* KERNELMASTER_H */
