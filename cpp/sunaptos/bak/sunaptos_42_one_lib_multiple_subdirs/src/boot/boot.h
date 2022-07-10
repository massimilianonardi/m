#ifndef BOOT_H
#define	BOOT_H

#include "sunaptos.h"

class Boot: virtual public Service
{
protected:
  Service* k;

public:
  Boot(Service* k);
  ~Boot();

  SERVICE_METHOD_DISPATCHER_DEFINITION
};

#endif	/* BOOT_H */
