#include "kernelmaster.h"
#include "serviceserver.h"
#include "serviceclient.h"
#include <iostream>
#include <string>
#include <windows.h>

KernelMaster::KernelMaster(Kernel* k)
{
  // todo: create a net connection to the "KernelNetwork"
  // todo: since there is no master kernel for the network a wot connection must be defined, or something...
  
  Sequence params, res;
  Service* srv = 0;
  params = "boot";
  res = f(Kernel::create_separate, params);
  srv = new ServiceClient(res);
//  std::cout << "\n[KernelMaster 01] " << (long) res[0];
//  srv = reinterpret_cast<Service*>((long) res[0]);
  srv->f(0, params = "");
  std::cout << "\n[KernelMaster 02]\n";
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
      // create a new lock
      // lock it
      // store in map <kkey, lock>
      // lock wait
      Lock* l = new Lock();
      l->lock();
      lm[(char*) kkey] = l;
      std::cout << "\n[KernelMaster::f 01] " << (long) l;
//      l->lock(3000);
      l->waitunlock();
//      Sleep(3000);
      std::cout << "\n[KernelMaster::f 01] unlocked";
      delete l;
      res = skey;
      // todo: wait for connect back and reply with ipc key, send key to caller as result...this avoids synchronization
    }
      break;

    case Kernel::notify_startup:
    {
      // get from map <kkey, lock>
      // unlock it
      // unmap it
      Lock* l = lm[(char*) params];
      std::cout << "\n[KernelMaster::f 01] " << (long) l;
      l->unlock();
      std::cout << "\n[KernelMaster::f 02]\n";
      lm[(char*) params] = 0;
      std::cout << "\n[KernelMaster::f 03]\n";
    }
      break;

    default:
      // error! function not supported!!!
      break;
  }

  std::cout << "\n[KernelMaster::f 99]\n";
  return res;
}
