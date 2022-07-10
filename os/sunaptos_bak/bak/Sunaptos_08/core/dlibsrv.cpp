#include "dlibsrv.h"

DLibSrv::DLibSrv(const char* name): DynamicLibraryLoader(name)
{
}

DLibSrv::~DLibSrv()
{
}

CommandListener* DLibSrv::create(Object* obj)
{
  typedef CommandListener* (*SRVConstructor)(Object*);
  SRVConstructor createsrv = (SRVConstructor) this->getFuncAddress("create");
  return (*createsrv)(obj);
}
