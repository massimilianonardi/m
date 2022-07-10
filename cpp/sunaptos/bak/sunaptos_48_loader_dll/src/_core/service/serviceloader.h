#ifndef SERVICELOADER_H
#define	SERVICELOADER_H

#include "service.h"
#include "dynamiclibraryloader.h"

class ServiceLoader: virtual public DynamicLibraryLoader
{
public:
//  ServiceLoader(const Sequence& name, SERVICE_METHOD_PARAMETERS);
//  using DynamicLibraryLoader::DynamicLibraryLoader;
//  ServiceLoader(const ServiceLoader& orig) = delete;
  inline ServiceLoader(const char* name): DynamicLibraryLoader(name){};
  virtual ~ServiceLoader();
//  inline Service& operator*(){return *srv;};

  Service* create(SERVICE_METHOD_PARAMETERS);
  void destroy(const Service* params);
  Service* try_create(SERVICE_METHOD_PARAMETERS);
  void try_destroy(const Service* params);

private:
//  inline ServiceLoader(){};
  ServiceLoader(const ServiceLoader& orig) = delete;
  ServiceLoader& operator=(const ServiceLoader& orig) = delete;
};

#endif	/* SERVICELOADER_H */
