#ifndef LOADER_H
#define	LOADER_H

#include "sunaptos.h"

class Loader: virtual public Service
{
public:
  Loader(SERVICE_METHOD_PARAMETERS);
  virtual ~Loader();

  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
  SERVICE_METHOD_DECLARATION(notify)

//private:
//  Service& loader_advanced;
};

#endif	/* LOADER_H */
