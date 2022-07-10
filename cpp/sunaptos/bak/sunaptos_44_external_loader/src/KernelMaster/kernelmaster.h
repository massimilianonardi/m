#ifndef KERNELMASTER_H
#define	KERNELMASTER_H

#include "sunaptos.h"

typedef std::map<std::string, Lock*> LockMap;

class KernelMaster: virtual public Service
{
protected:
  LockMap lm;

public:
//    enum {create_separate = 0}; // use enum from Kernel...

  KernelMaster(SERVICE_METHOD_PARAMETERS);
  ~KernelMaster();

  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
  SERVICE_METHOD_DECLARATION(notify)
};

#endif	/* KERNELMASTER_H */
