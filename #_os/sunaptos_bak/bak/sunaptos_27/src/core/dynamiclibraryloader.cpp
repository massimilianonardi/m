#include "sunaptos.h"

DynamicLibraryLoader::DynamicLibraryLoader(sequence& name)
{
#ifdef WIN32
//  name.ins('.', name.size() - 1);
  name = sequence(strcat(name, "."));
  hinst = LoadLibrary(name);
#elif defined LINUX
  hinst = dlopen(name, RTLD_LAZY);
#else
#endif
  if(hinst == 0)
  {
    throw "DynamicLibraryLoader::DynamicLibraryLoader...Library not found!";
  }
}

DynamicLibraryLoader::~DynamicLibraryLoader()
{
#ifdef WIN32
  FreeLibrary(hinst);
#elif defined LINUX
  dlclose(hinst);
#else
#endif
  hinst = 0;
}

void* DynamicLibraryLoader::getFuncAddress(sequence& name)
{
  if(hinst == 0)
  {
    throw "DynamicLibraryLoader::getFuncAddress...Library not loaded!";
  }
  
#ifdef WIN32
  void* res = (void*) GetProcAddress(hinst, name);
#elif defined LINUX
  void* res = (void*) dlsym(hinst, name);
#else
#endif
  if(res == 0)
  {
    throw "DynamicLibraryLoader::getFuncAddress...Process name not found in library!";
  }
  return res;
}

Service* DynamicLibraryLoader::create(Service* loader)
{
  typedef Service* (*OBJConstructor)(Service*);
  sequence fn = sequence("create");
  OBJConstructor createobj = (OBJConstructor) this->getFuncAddress(fn);
  return (*createobj)(loader);
}
