#include "dynamiclibraryloader.h"

DynamicLibraryLoader::DynamicLibraryLoader(const char* name) throw (const char*)
{
  hinst = LoadLibrary(name);
  if(hinst == 0)
  {
    throw "DynamicLibraryLoader::DynamicLibraryLoader(const char* name) throw (const char*)...Library not found!";
  }
}

DynamicLibraryLoader::~DynamicLibraryLoader()
{
  FreeLibrary(hinst);
  hinst = 0;
}

void* DynamicLibraryLoader::getFuncAddress(const char* name) throw (const char*)
{
  if(hinst == 0)
  {
    throw "DynamicLibraryLoader::getFuncAddress(const char* name) throw (const char*)...Library not loaded!";
  }
  
  void* res = (void*) GetProcAddress(hinst, name);
  if(res == 0)
  {
    throw "DynamicLibraryLoader::getFuncAddress(const char* name) throw (const char*)...Process name not found in library!";
  }
  return res;
}
