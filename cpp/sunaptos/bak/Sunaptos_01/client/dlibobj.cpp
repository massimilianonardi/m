#include "dlibobj.h"

DLibObj::DLibObj(const char* name) throw (const char*) : DynamicLibraryLoader(name)
{
}

Object* DLibObj::create(Loader* loader) throw (const char*)
{
  typedef Object* (*OBJConstructor)(Loader*);
  OBJConstructor createobj = (OBJConstructor) this->getFuncAddress("create");
  return (*createobj)(loader);
}
