#include "sunaptos.h"

DynamicLibraryManager::DynamicLibraryManager()
{
}

DynamicLibraryManager::~DynamicLibraryManager()
{
  // todo: destroy all objects
  // todo: destroy all libraries
}

Service* DynamicLibraryManager::create(char* name, Service* loader)
{
  DynamicLibraryLoader* dlib = new DynamicLibraryLoader(name);
  Service* srv = dlib->create(loader);
  sdlm[srv] = dlib;

  return srv;
}

bool DynamicLibraryManager::destroy(Service* service)
{
  DynamicLibraryLoader* dlib = sdlm[service];
  sdlm[service] = 0;
  delete dlib;
  delete service;
  
  return true;
}
