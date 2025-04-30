#include "kernelmaster.h"

KernelMaster::KernelMaster(SERVICE_METHOD_PARAMETERS)
{
  debug("[KernelMaster::KernelMaster 00]")
  debug("[KernelMaster::KernelMaster 99]")
}

KernelMaster::~KernelMaster()
{
}

SERVICE_REGISTER(KernelMaster)
SERVICE_REGISTER_END

SERVICE_METHOD_DEFINITION(KernelMaster, create)
{
  // KernelMaster::create should behave like dlib.create (to be replaced into serviceloader) so it returns Sequence(Service*)
  // 
  // create temporary listening server on this to receive notify
  // start new process with serviceserverextern with srv name and connection keys as params
  // wait notify
  // the new process will start a temporary client connecting to this to notify startup completion
  // return service client connecting to srv's server
  
//  std::string rname;
//  rname = ".";
//  rname += (const char*) params;
//  return ldr::i().create(rname.c_str());
//  debug("[KernelMaster::createSeparate 00]")
  Sequence res;
  Sequence kkey = generateKey();
  Sequence skey = generateKey();
  new ServiceServer(*this, kkey); // todo: manage through an instance manager...
  std::string name = (const char*) params;
  std::string key1 = (char*) kkey;
  std::string key2 = (char*) skey;
//  std::string cmd = "./process " + name + " 1 \"" + key1 + "\"" + " 1 \"" + key2 + "\"";
  std::string cmd = "./process ServiceServerExtern \"" + key1 + "\" \"" + key2 + "\" " + name;
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
  return *(new ServiceClient(skey));
  res = (char*) skey;
  debug("[KernelMaster::createSeparate 99]")
  return res;
}

SERVICE_METHOD_DEFINITION(KernelMaster, destroy)
{
}

SERVICE_METHOD_DEFINITION(KernelMaster, notify)
{
//  return ldr::i().notify(params);
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
