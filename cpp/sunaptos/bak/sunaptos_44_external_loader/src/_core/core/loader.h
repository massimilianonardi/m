#ifndef LOADER_H
#define	LOADER_H

#include <map>
#include "lock.h"
#include "service.h"

typedef std::map<std::string, Lock*> LockMap;

class Loader: virtual public Service
{
public:
//  Loader();
//  virtual ~Loader();
  SERVICE_DECLARATIONS
  // implemented interfaces methods
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
  SERVICE_METHOD_DECLARATION(notify)
  // custom methods
  SERVICE_METHOD_DECLARATION(exit)
  Sequence create(const Sequence& name, SERVICE_METHOD_PARAMETERS);

protected:
  LockMap lm;

private:
};

#endif	/* LOADER_H */
