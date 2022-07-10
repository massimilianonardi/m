#include "SunaptosProcess.h"
#include <iostream>

SunaptosProcess::SunaptosProcess()
{
  std::cout << "\n[SunaptosProcess 00]\n";
}

SunaptosProcess::~SunaptosProcess()
{
}

void SunaptosProcess::init(Sequence& p)
{
  // create local loader passing parameters received from calling loader to connect to calling loader

  // ask loader to load local srv and passing pointer to loader
  // loader will also create connection between local srv and srv that requested instantiation using params given by callin loader
  std::cout << "\n[SunaptosProcess 01]\n";
  new Kernel(p);
  std::cout << "\n[SunaptosProcess 02]\n";
}
