#include "dynamiclibraryloader.h"

#include <string>

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#include <dlfcn.h>
#else
#endif

#include "exception.h"

DynamicLibraryLoader::DynamicLibraryLoader(const char* name)
{
#ifdef WIN32
//  hinst = LoadLibrary(strcat(name, "."));
  hinst = LoadLibrary((std::string(name) + ".").c_str());
#elif defined LINUX
  hinst = dlopen(name, RTLD_LAZY);
#else
#endif
  if(hinst == 0) exception_throw_type(Exception::not_found)
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
  if(hinst == 0) exception_throw_type(Exception::null_pointer)
  void* res = getFuncAddress(name);
  if(res == 0) exception_throw_type(Exception::not_found)
  return res;
}

Service* DynamicLibraryLoader::create(SERVICE_METHOD_PARAMETERS)
{
  typedef Service* (*Constructor)(SERVICE_METHOD_PARAMETERS);
  return (*((Constructor) getFuncAddress("create")))(params);
}

void DynamicLibraryLoader::destroy(const Service* params)
{
  typedef void (*Destructor)(const Service*);
  (*((Destructor) getFuncAddress("destroy")))(params);
}

Service* DynamicLibraryLoader::try_create(SERVICE_METHOD_PARAMETERS)
{
  typedef Service* (*Constructor)(SERVICE_METHOD_PARAMETERS);
  Service* srv = (*((Constructor) try_getFuncAddress("try_create")))(params);
  if((long) srv == SERVICE_ERROR) exception_throw_type(Exception::null_pointer)
  return srv;
}

void DynamicLibraryLoader::try_destroy(const Service* params)
{
  typedef SERVICE_METHOD_RETURN_TYPE (*Destructor)(const Service*);
  SERVICE_METHOD_RETURN_TYPE res = (*((Destructor) try_getFuncAddress("try_destroy")))(params);
  if(res == (Sequence) SERVICE_ERROR) exception_throw_type(Exception::null_pointer)
}
