#include "servicesequence.h"
#include "service.h"

ServiceSequence::ServiceSequence(const Sequence& name, SERVICE_METHOD_PARAMETERS): dlib(new DynamicLibraryLoader(name))
{
//  dlib = new DynamicLibraryLoader(name);
  Service* srv = dlib->create(params);
  *dynamic_cast<Sequence*>(this) = *srv;
//  owner = true;
}

//ServiceSequence::ServiceSequence(const ServiceSequence& ss)
//{
//}
//
//ServiceSequence::operator=(const ServiceSequence& ss)
//{
//}

ServiceSequence::~ServiceSequence()
{
  debug_line
//  if(dlib.use_count() == 1)
//  {
//    debug_line
//    dlib->destroy(&(Service&) *dynamic_cast<Sequence*>(this));
//  }
//  if(owner)
//  {
//    dlib->destroy(&(Service&) *dynamic_cast<Sequence*>(this));
//    delete dlib;
//  }
}
