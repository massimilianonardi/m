#include "bootloaderserver.h"
#include <iostream>
#include <windows.h>

BootLoaderServer::BootLoaderServer(Loader* loader)
{
  std::cout << " [BootLoaderServer::BootLoaderServer] ";
  this->loader = loader;
  Sequence s;
  boot(s, s);
}

BootLoaderServer::~BootLoaderServer()
{
  std::cout << " [BootLoaderServer::~BootLoaderServer] ";
}

Sequence& BootLoaderServer::boot(Sequence& params, Sequence& res)
{
  std::cout << "\n[BootLoaderServer::boot] 01";
  loader->getInterface("BootLoader", "BootLoaderServer2", true);
  std::cout << "\n[BootLoaderServer::boot] 02";
  Sleep(5000);
  loader->getInterface("BootLoader", "BootLoaderServer2", false);
  std::cout << "\n[BootLoaderServer::boot] 03";
  return res;
}
