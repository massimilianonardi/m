#ifndef LOADER_H
#define	LOADER_H

#include "sunaptos.h"

#include "ServiceLoader.h"

#include "lock.h"

#include <map>

class Loader: virtual public service
{
public:
  Loader(SERVICE_METHOD_PARAMETERS);
  virtual ~Loader();

  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(id)
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
  SERVICE_METHOD_DECLARATION(stop)
  SERVICE_METHOD_DECLARATION(wait_unlock)
  SERVICE_METHOD_DECLARATION(search)
  SERVICE_METHOD_DECLARATION(validate)

private:
  std::map<service*, ServiceLoader*> dlib_map;
  Lock lck;
  sequence ldr_id;
};

#endif	/* LOADER_H */
