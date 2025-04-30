#ifndef SERVICEEXTERN_H
#define	SERVICEEXTERN_H

#include "sunaptos.h"

class ServiceExtern: virtual public Service
{
public:
  ServiceExtern(SERVICE_METHOD_PARAMETERS);
  virtual ~ServiceExtern();

  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
  SERVICE_METHOD_DECLARATION(notify)
};

#endif	/* SERVICEEXTERN_H */
