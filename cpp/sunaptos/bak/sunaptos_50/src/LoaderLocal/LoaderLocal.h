#ifndef LOADERLOCAL_H
#define	LOADERLOCAL_H

#include "sunaptos.h"

#include "ServiceLoader.h"

#include "lock.h"

#include <map>

class LoaderLocal: virtual public Service
{
public:
  LoaderLocal(SERVICE_METHOD_PARAMETERS);
  virtual ~LoaderLocal();

  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
  SERVICE_METHOD_DECLARATION(stop)
  SERVICE_METHOD_DECLARATION(lock)
  SERVICE_METHOD_DECLARATION(unlock)
  SERVICE_METHOD_DECLARATION(try_lock)
  SERVICE_METHOD_DECLARATION(wait_unlock)

protected:
  std::map<Service*, ServiceLoader*> dlib_map;
  Lock lck;
};

#endif	/* LOADERLOCAL_H */
