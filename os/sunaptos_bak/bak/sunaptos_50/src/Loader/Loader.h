#ifndef LOADER_H
#define	LOADER_H

#include "sunaptos.h"

#include "ServiceLoader.h"

#include "lock.h"

#include <vector>
#include <map>
#include <thread>

class Loader: virtual public Service
{
public:
  Loader(SERVICE_METHOD_PARAMETERS);
  virtual ~Loader();

  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
  SERVICE_METHOD_DECLARATION(set)
  SERVICE_METHOD_DECLARATION(stop)
  SERVICE_METHOD_DECLARATION(lock)
  SERVICE_METHOD_DECLARATION(unlock)
  SERVICE_METHOD_DECLARATION(try_lock)
  SERVICE_METHOD_DECLARATION(wait_unlock)

private:
  ServiceLoader* ldr_dlib;
  Service* ldr;
  Lock lck;
  std::vector<std::thread> threads_loaders_destroyers;
  std::map<Service*, Service*> ldr_map;
};

#endif	/* LOADER_H */
