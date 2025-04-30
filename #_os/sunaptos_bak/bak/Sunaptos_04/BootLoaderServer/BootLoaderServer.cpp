#include "BootLoaderServer.h"

#include <windows.h>
#include <iostream>

BootLoaderServer::BootLoaderServer(Loader* loader)
{
  std::cout << "\n[BootLoaderServer::BootLoaderServer]";
  this->loader = loader;
  boot(0);
}

BootLoaderServer::~BootLoaderServer()
{
  std::cout << "\n[BootLoaderServer::~BootLoaderServer] ";
}

Data* BootLoaderServer::boot(Data* data)
{
  std::cout << "\n[BootLoaderServer::boot] 01";
  loader->getInterface("BootLoader", "BootLoaderServer2", true);
  std::cout << "\n[BootLoaderServer::boot] 02";
  loader->getInterface("BootLoader", "BootLoaderServer2", false);
  std::cout << "\n[BootLoaderServer::boot] 03";
  return 0;
}
