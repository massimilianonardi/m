#include "dynamiclibraryloader.h"

#include <string>

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#include <dlfcn.h>
#else
#endif

DynamicLibraryLoader::DynamicLibraryLoader(char* name)
{
#ifdef WIN32
//  hinst = LoadLibrary(strcat(name, "."));
  hinst = LoadLibrary((std::string(name) + ".").c_str());
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

Object* DynamicLibraryLoader::create(Object* loader)
{
  typedef Object* (*OBJConstructor)(Object*);
  OBJConstructor createobj = (OBJConstructor) this->getFuncAddress("create");
  return (*createobj)(loader);
}
