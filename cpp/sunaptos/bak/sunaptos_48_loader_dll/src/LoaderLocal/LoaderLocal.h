#ifndef LOADERLOCAL_H
#define	LOADERLOCAL_H

#include "sunaptos.h"

class LoaderLocal: virtual public Service
{
public:
  LoaderLocal(SERVICE_METHOD_PARAMETERS);
  virtual ~LoaderLocal();

  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
};

#endif	/* LOADERLOCAL_H */
