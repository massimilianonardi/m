#include "kernelmaster.h"
#include "serviceserver.h"
#include <iostream>
#include <string>
#include <windows.h>

KernelMaster::KernelMaster(Kernel* k)
{
  // todo: create a net connection to the "KernelNetwork"
  // todo: since there is no master kernel for the network a wot connection must be defined, or something...
  
  Sequence params;
  params = "boot";
  f(Kernel::create_separate, params);
}

KernelMaster::~KernelMaster()
{
}

Sequence KernelMaster::f(number i, Sequence& params)
{
  Sequence res;
  std::cout << "\n[KernelMaster::f 00] " << (long) i << " " << (char*) params;

  // todo: a real instancemanager now only creation is supported, no maps no storing pointers...
  switch((long) i)
  {
    case Kernel::create_separate:
    {
#ifdef WIN32
      Sequence kkey = ServiceServer::generateKey();
      Sequence skey = ServiceServer::generateKey();
      new ServiceServer(this, kkey); // todo: manage through an instance manager...
      std::string name = (char*) params;
      std::string key1 = (char*) kkey;
      std::string key2 = (char*) skey;
      std::string cmd = "start process " + name + " 1 \"" + key1 + "\"" + " 1 \"" + key2 + "\"";
      std::cout << "\n[KernelMaster::f 01] cmd = " << cmd;
#elif defined LINUX
      // todo: linux code
#else
#endif
//      res = system(cmd.c_str());
      system(cmd.c_str());
      Sleep(3000);
      res = skey;
      // todo: wait for connect back and reply with ipc key, send key to caller as result...this avoids synchronization
    }
      break;

    default:
      // error! function not supported!!!
      break;
  }

  std::cout << "\n[KernelMaster::f 99]\n";
  return res;
}
