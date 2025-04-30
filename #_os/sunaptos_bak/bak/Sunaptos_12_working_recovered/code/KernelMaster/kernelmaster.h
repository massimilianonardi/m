#ifndef KERNELMASTER_H
#define	KERNELMASTER_H

#include "sequence.h"
#include "service.h"
#include "kernel.h"
#include "lock.h"

#include <map>
#include <string>
using namespace std;

//typedef map<char*, Lock*> LockMap;
typedef map<string, Lock*> LockMap;

class KernelMaster: virtual public Service
{
  protected:
    LockMap lm;

  public:
//    enum {create_separate = 0}; // use enum from Kernel...

    KernelMaster(Kernel* k);
    ~KernelMaster();

    Sequence f(number i, Sequence& params);
};

#endif	/* KERNELMASTER_H */
