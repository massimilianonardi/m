#include "bootloaderserver2.h"
#include <iostream>

BootLoaderServer2::BootLoaderServer2(Loader* loader)
{
  std::cout << "\n[BootLoaderServer2::BootLoaderServer2] ";
  this->loader = loader;
  Sequence seq;
  boot(seq, seq);
}

BootLoaderServer2::~BootLoaderServer2()
{
  std::cout << "\n[BootLoaderServer2::~BootLoaderServer2] ";
}

Sequence& BootLoaderServer2::boot(Sequence& params, Sequence& res)
{
  std::cout << "\n[BootLoaderServer2::boot] ";
  return res;
}
