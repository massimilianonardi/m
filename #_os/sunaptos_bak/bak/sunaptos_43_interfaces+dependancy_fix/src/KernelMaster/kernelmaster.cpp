#include "kernelmaster.h"

KernelMaster::KernelMaster(Service* k)
{
  debug("[KernelMaster::KernelMaster 00]")
  // todo: create a net connection to the "KernelNetwork"
  // todo: since there is no master kernel for the network a wot connection must be defined, or something...
  
  Sequence params, res;
  Service* srv = 0;
  params = "boot";
//  res = f(res = Kernel::create_separate, params);
  res = create(params);
//  res = f("createSeparate", params);
//  res = createSeparate(params);
  debug("[KernelMaster::KernelMaster 01]")
  srv = new ServiceClient(res);
//  srv->f(res = 0, params = "");
//  srv->start(0);
  srv->f("start", 0);
//  srv->f((long) ServiceMethods::start, 0);
  debug("[KernelMaster::KernelMaster 99]")
}

KernelMaster::~KernelMaster()
{
}

SERVICE_REGISTER(KernelMaster)
SERVICE_REGISTER_END

SERVICE_METHOD_DEFINITION(KernelMaster, create)
{
//  debug("[KernelMaster::createSeparate 00]")
  Sequence res;
  Sequence kkey = generateKey();
  Sequence skey = generateKey();
  new ServiceServer(*this, kkey); // todo: manage through an instance manager...
  std::string name = (const char*) params;
  std::string key1 = (char*) kkey;
  std::string key2 = (char*) skey;
  std::string cmd = "./process " + name + " 1 \"" + key1 + "\"" + " 1 \"" + key2 + "\"";
  systemLaunch(cmd.c_str());
  // create a new lock
  // lock it
  // store in map <kkey, lock>
  // lock wait
  Lock* l = new Lock();
  l->lock();
  lm[(char*) kkey] = l;
//  debug("[KernelMaster::createSeparate 02] lock = " << (long) l)
//  l->lock(3000);
  l->waitunlock();
//  Sleep(3000);
//  debug("[KernelMaster::createSeparate 03] unlocked")
  delete l;
  // wait for connect back and reply with ipc key, send key to caller as result...this avoids synchronization
//  res = skey;
  res = (char*) skey;
  debug("[KernelMaster::createSeparate 99]")
  return res;
}

Sequence KernelMaster::createRemote(const Sequence& params)
{
  debug("[KernelMaster::createRemote 00]")
  Sequence res;
  debug("[KernelMaster::createRemote 99]")
  return res;
}

SERVICE_METHOD_DEFINITION(KernelMaster, notify)
{
//  debug("[KernelMaster::notifyStartup 00]")
  Sequence res;
  // get from map <kkey, lock>
  // unlock it
  // unmap it
  Lock* l = lm[(const char*) params];
//  debug("[KernelMaster::notifyStartup 01] lock = " << (long) l)
  l->unlock();
//  debug("[KernelMaster::notifyStartup 02] lock = " << (long) l)
  lm[(const char*) params] = 0;
  debug("[KernelMaster::notifyStartup 99]")
  return res;
}
