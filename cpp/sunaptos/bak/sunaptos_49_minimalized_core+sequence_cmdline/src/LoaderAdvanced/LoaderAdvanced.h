#ifndef LOADERADVANCED_H
#define	LOADERADVANCED_H

#include "sunaptos.h"

#include "lock.h"

#include <map>

typedef std::map<std::string, Lock*> LockMap;

class LoaderAdvanced: virtual public Service
{
public:
  LoaderAdvanced(SERVICE_METHOD_PARAMETERS);
  virtual ~LoaderAdvanced();

  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
  SERVICE_METHOD_DECLARATION(notify)

private:
  LockMap lm;
};

#endif	/* LOADERADVANCED_H */
