#include "kernelmaster.h"

KernelMaster::KernelMaster(Service* k)
{
  try_managed
  debug("[KernelMaster::KernelMaster 00]")
  // todo: create a net connection to the "KernelNetwork"
  // todo: since there is no master kernel for the network a wot connection must be defined, or something...
  
  Sequence params, res;
  Service* srv = 0;
  params = "boot";
  res = f(Kernel::create_separate, params);
  debug("[KernelMaster::KernelMaster 01]")
  srv = new ServiceClient(res);
  srv->f(0, params = "");
  debug("[KernelMaster::KernelMaster 99]")
  catch_managed("KernelMaster::KernelMaster")
  rethrow_managed
  exit_try_catch_managed
}

KernelMaster::~KernelMaster()
{
}

Sequence KernelMaster::f(number i, Sequence& params)
{
//  debug("[KernelMaster::f 00] i = " << (long) i << " - params = " << (char*) params)
  Sequence res;

  switch((long) i)
  {
    case Kernel::create_separate:
      res = createSeparate(params);
      break;

    case Kernel::create_remote:
      res = createRemote(params);
      break;

    case Kernel::notify_startup:
      res = notifyStartup(params);
      break;

    default:
      // error! function not supported!!!
      break;
  }

//  debug("[KernelMaster::f 99]")
  return res;
}

Sequence KernelMaster::createSeparate(Sequence& params)
{
  try_managed
//  debug("[KernelMaster::createSeparate 00]")
  Sequence res;
  Sequence kkey = generateKey();
  Sequence skey = generateKey();
  new ServiceServer(this, kkey); // todo: manage through an instance manager...
  std::string name = (char*) params;
  std::string key1 = (char*) kkey;
  std::string key2 = (char*) skey;
#ifdef WIN32
  std::string cmd = "start ";
#elif defined LINUX
  std::string cmd = "./";
#else
#endif
  cmd += "process " + name + " 1 \"" + key1 + "\"" + " 1 \"" + key2 + "\"";
#ifdef LINUX
  cmd += " &";
#else
#endif
//  debug("[KernelMaster::createSeparate 01] cmd = " << cmd)
  system(cmd.c_str());
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
  catch_managed("KernelMaster::createSeparate")
  rethrow_managed
  exit_try_catch_managed
}

Sequence KernelMaster::createRemote(Sequence& params)
{
  try_managed
  debug("[KernelMaster::createRemote 00]")
  Sequence res;
  debug("[KernelMaster::createRemote 99]")
  return res;
  catch_managed("KernelMaster::createRemote")
  rethrow_managed
  exit_try_catch_managed
}

Sequence KernelMaster::notifyStartup(Sequence& params)
{
  try_managed
//  debug("[KernelMaster::notifyStartup 00]")
  Sequence res;
  // get from map <kkey, lock>
  // unlock it
  // unmap it
  Lock* l = lm[(char*) params];
//  debug("[KernelMaster::notifyStartup 01] lock = " << (long) l)
  l->unlock();
//  debug("[KernelMaster::notifyStartup 02] lock = " << (long) l)
  lm[(char*) params] = 0;
  debug("[KernelMaster::notifyStartup 99]")
  return res;
  catch_managed("KernelMaster::notifyStartup")
  rethrow_managed
  exit_try_catch_managed
}
