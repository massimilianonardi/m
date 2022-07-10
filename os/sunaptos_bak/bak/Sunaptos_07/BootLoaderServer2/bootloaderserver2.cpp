#include "bootloaderserver2.h"
//#include "sequenceomogeneus.h"
#include "sequence.h"
#include <iostream>

BootLoaderServer2::BootLoaderServer2(Loader* loader)
{
  std::cout << " [BootLoaderServer2::BootLoaderServer2] ";
//  numseq seq;
  Sequence seq;
  boot(seq, seq);
}

BootLoaderServer2::~BootLoaderServer2()
{
  std::cout << " [BootLoaderServer2::~BootLoaderServer2] ";
}

Sequence& BootLoaderServer2::boot(Sequence& params, Sequence& res)
{
  std::cout << " [BootLoaderServer2::boot] ";
  return res;
}
