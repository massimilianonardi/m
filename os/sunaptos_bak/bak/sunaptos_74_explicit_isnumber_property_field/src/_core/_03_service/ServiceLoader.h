#ifndef SERVICELOADER_H
#define	SERVICELOADER_H

#include "Service.h"
#include "DynamicLibraryLoader.h"

class ServiceLoader: virtual public DynamicLibraryLoader
{
public:
//  using DynamicLibraryLoader::DynamicLibraryLoader;
  inline ServiceLoader(const char* name): DynamicLibraryLoader(name){};
  inline virtual ~ServiceLoader(){};

  Service* create(SERVICE_METHOD_PARAMETERS);
  void destroy(const Service* params);
  Service* try_create(SERVICE_METHOD_PARAMETERS);
  void try_destroy(const Service* params);

private:
  ServiceLoader(const ServiceLoader& orig) = delete;
  ServiceLoader& operator=(const ServiceLoader& orig) = delete;
};

#endif	/* SERVICELOADER_H */
