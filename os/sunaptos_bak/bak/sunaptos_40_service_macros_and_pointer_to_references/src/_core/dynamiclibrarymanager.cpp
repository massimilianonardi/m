#include "dynamiclibrarymanager.h"

DynamicLibraryManager::DynamicLibraryManager()
{
}

DynamicLibraryManager::~DynamicLibraryManager()
{
  // todo: destroy all objects
  // todo: destroy all libraries
}

//Service* DynamicLibraryManager::create(char* name, Service* loader)
Service& DynamicLibraryManager::create(char* name, Service* loader)
{
  DynamicLibraryLoader* dlib = new DynamicLibraryLoader(name);
  Service* srv = dynamic_cast<Service*>(dlib->create(loader));
  sdlm[srv] = dlib;

//  return srv;
  return *srv;
}

//bool DynamicLibraryManager::destroy(Service* service)
bool DynamicLibraryManager::destroy(Service& service)
{
//  DynamicLibraryLoader* dlib = sdlm[service];
  DynamicLibraryLoader* dlib = sdlm[&service];
//  sdlm[service] = 0;
  sdlm[&service] = 0;
  delete dlib;
//  delete service;
  delete &service;
  
  return true;
}
