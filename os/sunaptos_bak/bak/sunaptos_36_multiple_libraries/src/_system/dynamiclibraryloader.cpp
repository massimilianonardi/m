#include "dynamiclibraryloader.h"

DynamicLibraryLoader::DynamicLibraryLoader(char* name)
{
#ifdef WIN32
//  name = strcat(name, ".");
//  hinst = LoadLibrary(name);
//  hinst = LoadLibrary("simple.");
  hinst = LoadLibrary((string(name) + ".").c_str());
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

void* DynamicLibraryLoader::getFuncAddress(char* name)
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
  OBJConstructor createobj = (OBJConstructor) this->getFuncAddress("create");
  return (*createobj)(loader);
}
