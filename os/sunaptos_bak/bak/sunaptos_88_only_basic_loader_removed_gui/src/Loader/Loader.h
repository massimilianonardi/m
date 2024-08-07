#ifndef LOADER_H
#define	LOADER_H

#include "sunaptos.h"

#include "ServiceLoader.h"

#include "lock.h"

#include <map>

class Loader: virtual public Service
{
public:
  Loader(SERVICE_METHOD_PARAMETERS);
  virtual ~Loader();

  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
  SERVICE_METHOD_DECLARATION(stop)
  SERVICE_METHOD_DECLARATION(wait_unlock)

private:
  std::map<Service*, ServiceLoader*> dlib_map;
  Lock lck;
};

#endif	/* LOADER_H */
