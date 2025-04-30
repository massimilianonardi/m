#include "DynamicLibraryLoader.h"

#include <string>

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#include <dlfcn.h>
#else
#endif

#include "Exception.h"

DynamicLibraryLoader::DynamicLibraryLoader(const char* name)
{
#ifdef WIN32
//  hinst = LoadLibrary(strcat(name, "."));
  hinst = LoadLibrary((std::string(name) + ".").c_str());
#elif defined LINUX
  hinst = dlopen(name, RTLD_LAZY);
#else
#endif
  if(hinst == 0) exception_throw_type(exception_type::not_found)
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

void* DynamicLibraryLoader::getFuncAddress(const char* name)
{
#ifdef WIN32
  return (void*) GetProcAddress(hinst, name);
#elif defined LINUX
  return (void*) dlsym(hinst, name);
#else
#endif
}

void* DynamicLibraryLoader::try_getFuncAddress(const char* name)
{
  if(hinst == 0) exception_throw_type(exception_type::null_pointer)
  void* res = getFuncAddress(name);
  if(res == 0) exception_throw_type(exception_type::not_found)
  return res;
}
