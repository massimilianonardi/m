#ifndef LOADERADVANCED_H
#define	LOADERADVANCED_H

#include "sunaptos.h"

#include "lock.h"

#include <map>
#include <string>

class LoaderAdvanced: virtual public Service
{
public:
  LoaderAdvanced(SERVICE_METHOD_PARAMETERS);
  virtual ~LoaderAdvanced();

  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
  SERVICE_METHOD_DECLARATION(notify)
  SERVICE_METHOD_DECLARATION(stop)
//  SERVICE_METHOD_DECLARATION(lock)
//  SERVICE_METHOD_DECLARATION(unlock)
//  SERVICE_METHOD_DECLARATION(try_lock)
  SERVICE_METHOD_DECLARATION(wait_unlock)

private:
  std::map<std::string, Lock*> lm;
  Lock lck;
  std::map<Service*, Service*> rldr_map;
};

#endif	/* LOADERADVANCED_H */
