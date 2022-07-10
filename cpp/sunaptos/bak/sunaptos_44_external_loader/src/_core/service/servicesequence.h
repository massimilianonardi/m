#ifndef SERVICESEQUENCE_H
#define	SERVICESEQUENCE_H

#include "sequence.h"
//#include "service.h"
#include "dynamiclibraryloader.h"

#include <memory>

class ServiceSequence: virtual public Sequence
{
public:
  ServiceSequence(const Sequence& name, SERVICE_METHOD_PARAMETERS);
  virtual ~ServiceSequence();
//  ServiceSequence(const ServiceSequence& ss);
//  ServiceSequence& operator=(const ServiceSequence& ss);
private:
//  std::shared_ptr<DynamicLibraryLoader> dlib;
//  bool owner;
  DynamicLibraryLoader* dlib;
//  Service* srv;
};

#endif	/* SERVICESEQUENCE_H */
