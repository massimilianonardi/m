#include "sunaptos.h"

DynamicLibraryLoader::DynamicLibraryLoader(Sequence& name)
{
  name.ins('.', name.size() - 1);

  hinst = LoadLibrary(name);
  if(hinst == 0)
  {
    throw "DynamicLibraryLoader::DynamicLibraryLoader...Library not found!";
  }
}

DynamicLibraryLoader::~DynamicLibraryLoader()
{
  FreeLibrary(hinst);
  hinst = 0;
}

void* DynamicLibraryLoader::getFuncAddress(Sequence& name)
{
  if(hinst == 0)
  {
    throw "DynamicLibraryLoader::getFuncAddress...Library not loaded!";
  }
  
  void* res = (void*) GetProcAddress(hinst, name);
  if(res == 0)
  {
    throw "DynamicLibraryLoader::getFuncAddress...Process name not found in library!";
  }
  return res;
}

Service* DynamicLibraryLoader::create(Service* loader)
{
  typedef Service* (*OBJConstructor)(Service*);
  Sequence fn = Sequence("create");
  OBJConstructor createobj = (OBJConstructor) this->getFuncAddress(fn);
  return (*createobj)(loader);
}
