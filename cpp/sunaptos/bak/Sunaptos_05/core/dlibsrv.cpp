#include "dlibsrv.h"

DLibSrv::DLibSrv(const char* name) throw (const char*) : DynamicLibraryLoader(name)
{
}

CommandListener* DLibSrv::create(Object* obj) throw (const char*)
{
  typedef CommandListener* (*SRVConstructor)(Object*);
  SRVConstructor createsrv = (SRVConstructor) this->getFuncAddress("create");
  return (*createsrv)(obj);
}
