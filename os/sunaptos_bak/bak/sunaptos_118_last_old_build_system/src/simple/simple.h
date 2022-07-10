#ifndef SIMPLE_H
#define	SIMPLE_H

#include "sunaptos.h"

class Simple: virtual public service
{
public:
  Simple(SERVICE_METHOD_PARAMETERS);
  ~Simple();

  SERVICE_DISPATCHER_DECLARATION
  SERVICE_METHOD_DECLARATION(get)
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
  inline sequence test1(const sequence& params){debug("invoking_test1") return "test1\n";};
  inline sequence test2(const sequence& params){debug("invoking_test2") exception_throw return "test2\n";};
};

#endif	/* SIMPLE_H */
