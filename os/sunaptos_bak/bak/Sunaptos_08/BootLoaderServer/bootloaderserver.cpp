#include "bootloaderserver.h"
#include "sequence.h"
#include "storage.h"
#include <iostream>
#include <windows.h>

BootLoaderServer::BootLoaderServer(Loader* loader)
{
  std::cout << "\n[BootLoaderServer::BootLoaderServer] ";
  this->loader = loader;
  Sequence s;
  boot(s, s);
}

BootLoaderServer::~BootLoaderServer()
{
  std::cout << "\n[BootLoaderServer::~BootLoaderServer] ";
}

Sequence& BootLoaderServer::boot(Sequence& params, Sequence& res)
{
  std::cout << "\n[BootLoaderServer::boot] 01";
//  loader->getInterface("BootLoader", "BootLoaderServer2", true);
//  std::cout << "\n[BootLoaderServer::boot] 02";
//  Sleep(5000);
//  loader->getInterface("BootLoader", "BootLoaderServer2", false);
//  std::cout << "\n[BootLoaderServer::boot] 03";

  Storage* storage = dynamic_cast<Storage*>(loader->getInterface("Storage", "StorageOSFS", false));
  std::cout << "\n[BootLoaderServer::boot] 04";
  Sequence name;
  Sequence sind;
  Sequence sval;
  name = "2000003";
  sind << new Sequence();
  sind << new Sequence();
  sval << new Sequence();
  sval << new Sequence();
  sind(0) << (number) 0 << 2;
  sind(1) << (number) 0 << 3;
  sval(0) << 1;
  sval(1) << 2;

  params.resize(0);
  res.resize(0);
  params << &sval;
//  params << new Sequence();
  storage->create(params, res);
  std::cout << "\n[BootLoaderServer::boot] 05";

  params.resize(0);
  res.resize(0);
  params << &name;
  params << &sind;
  params << &sval;
  std::cout << "\n[BootLoaderServer::boot] 06";
  storage->ins(params, res);
  std::cout << "\n[BootLoaderServer::boot] 07";
  params.resize(0);
  res.resize(0);
  params << &name;
  storage->get(params, res);
  std::cout << "\n[BootLoaderServer::boot] 08";
  delete storage;
  std::cout << "\n[BootLoaderServer::boot] 09";

  return res;
}
