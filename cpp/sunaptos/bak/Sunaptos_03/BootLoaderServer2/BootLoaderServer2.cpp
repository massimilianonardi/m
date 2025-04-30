#include "BootLoaderServer2.h"
#include <iostream>

BootLoaderServer2::BootLoaderServer2(Loader* loader)
{
  std::cout << " [BootLoaderServer2::BootLoaderServer2] ";
  boot(0);
}

BootLoaderServer2::~BootLoaderServer2()
{
  std::cout << " [BootLoaderServer2::~BootLoaderServer2] ";
}

Data* BootLoaderServer2::boot(Data* data)
{
  std::cout << " [BootLoaderServer2::boot] ";
  return 0;
}
