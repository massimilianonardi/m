#ifndef SIMPLE_H
#define	SIMPLE_H

#include "sunaptos.h"

class Simple: virtual public Service
{
public:
  Simple(Service* k);
  ~Simple();

  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
  inline Sequence test1(const Sequence& params){debug("invoking_test1") return "test1\n";};
  inline Sequence test2(const Sequence& params){debug("invoking_test2") exception_throw return "test2\n";};
};

#endif	/* SIMPLE_H */
