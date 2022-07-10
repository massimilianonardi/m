#include "dlibobj.h"

DLibObj::DLibObj(const char* name): DynamicLibraryLoader(name)
{
}

DLibObj::~DLibObj()
{
}

Object* DLibObj::create(Loader* loader)
{
  typedef Object* (*OBJConstructor)(Loader*);
  OBJConstructor createobj = (OBJConstructor) this->getFuncAddress("create");
  return (*createobj)(loader);
}
