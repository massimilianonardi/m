#ifndef BOOT_H
#define	BOOT_H

#include "sunaptos.h"

class Boot: virtual public service
{
protected:
  service* k;

public:
//  Boot(service* k);
  Boot(SERVICE_METHOD_PARAMETERS);
  ~Boot();

public:
  SERVICE_METHOD_DECLARATION(start)
  SERVICE_METHOD_DECLARATION(stop)
};

#endif	/* BOOT_H */
