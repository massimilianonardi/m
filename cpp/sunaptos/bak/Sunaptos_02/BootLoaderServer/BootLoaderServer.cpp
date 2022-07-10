#include "BootLoaderServer.h"
#include <iostream>

BootLoaderServer::BootLoaderServer(Loader* loader)
{
  std::cout << " [BootLoaderServer::BootLoaderServer] ";
  boot(0);
}

BootLoaderServer::~BootLoaderServer()
{
  std::cout << " [BootLoaderServer::~BootLoaderServer] ";
}

Data* BootLoaderServer::boot(Data* data)
{
  std::cout << " [BootLoaderServer::boot] ";
  return 0;
}
