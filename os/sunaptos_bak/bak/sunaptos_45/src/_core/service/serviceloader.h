#ifndef SERVICELOADER_H
#define	SERVICELOADER_H

#include "service.h"
#include "dynamiclibraryloader.h"

class ServiceLoader//: virtual public Service
{
public:
  ServiceLoader(const Sequence& name, SERVICE_METHOD_PARAMETERS);
  virtual ~ServiceLoader();
  ServiceLoader(const ServiceLoader& orig);
  ServiceLoader& operator=(const ServiceLoader& orig);
  inline Service& operator*(){return *srv;};
private:
  DynamicLibraryLoader* dlib;
  Service* srv;
};

#endif	/* SERVICELOADER_H */
