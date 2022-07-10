#ifndef BOOT_H
#define	BOOT_H

#include "sunaptos.h"

class Boot: virtual public Service
{
protected:
  Service* k;

public:
//  Boot(Service* k);
  Boot(SERVICE_METHOD_PARAMETERS);
  ~Boot();

public:
  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(start)
  SERVICE_METHOD_DECLARATION(stop)
};

#endif	/* BOOT_H */
