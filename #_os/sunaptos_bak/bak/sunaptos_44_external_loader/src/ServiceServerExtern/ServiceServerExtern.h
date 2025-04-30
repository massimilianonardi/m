#ifndef SERVICESERVEREXTERN_H
#define	SERVICESERVEREXTERN_H

#include "sunaptos.h"

class ServiceServerExtern: virtual public Service
{
public:
  ServiceServerExtern(SERVICE_METHOD_PARAMETERS);
  virtual ~ServiceServerExtern();

  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
  SERVICE_METHOD_DECLARATION(notify)
};

#endif	/* SERVICESERVEREXTERN_H */
