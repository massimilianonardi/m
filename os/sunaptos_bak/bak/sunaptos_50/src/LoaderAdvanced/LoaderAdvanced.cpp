#include <string>

#include "LoaderAdvanced.h"

#include "functions.h"
#include "serviceserver.h"
#include "serviceclient.h"

// TODO: ipc with instantiated processes and ability to terminate them
// TODO: not manage itself the processes, but export interfaces to allow a more complex loader to do the management using this loader features
// TODO: dlib management
// TODO: ufn support
// TODO: services instantiation path detection and management
// TODO: security manager
// TODO: config with events mechanism
// TODO: params structure
// TODO: implement as wrapper and ability to change the underlying loader (no ipc, only on local process). defaults to LoaderLocal, current process srv may change it
//       eg this means that LoaderServer (who is wrapping a srv called as external process), may subsitute the loader accordingly to LoaderAdvanced so that an ipc management 
//       can be done
// TODO: LoaderLocal, LoaderProcess, LoaderNetwork (ll, lp and ln only perform low level create and destroy, not management), LoaderManager (manages all instances)
LoaderAdvanced::LoaderAdvanced(SERVICE_METHOD_PARAMETERS)
{
}

LoaderAdvanced::~LoaderAdvanced()
{
  debug_line
}

SERVICE_REGISTER(LoaderAdvanced)
SERVICE_REGISTER_END

SERVICE_METHOD_DEFINITION(LoaderAdvanced, create)
{
  Sequence kkey = generateKey();
  Sequence skey = generateKey();
  Sequence srv_params = (const char*) params;
  srv_params << kkey;
  srv_params << skey;
  if(0 < params.size()) srv_params << params(0);
  new ServiceServer(*this, kkey);
//  std::string name = (const char*) params;
//  std::string key1 = (char*) kkey;
//  std::string key2 = (char*) skey;
//  std::string cmd = "./process LoaderServer \"" + key1 + "\" \"" + key2 + "\" " + name;
  std::string cmd = "./process LoaderServer \"";
  cmd += std::string(srv_params.to_text());
  cmd += "\"";
  debug(cmd.c_str())
  systemLaunch(cmd.c_str());
  Lock* l = new Lock();
  l->lock();
  lm[(char*) kkey] = l;
  l->waitunlock();
  delete l;
  return *(new ServiceClient(skey));
}

SERVICE_METHOD_DEFINITION(LoaderAdvanced, destroy)
{
  debug_line
  return SERVICE_NULL;
}

SERVICE_METHOD_DEFINITION(LoaderAdvanced, notify)
{
  Sequence res;
  Lock* l = lm[(const char*) params];
  l->unlock();
  lm[(const char*) params] = 0;
  return SERVICE_NULL;
}

SERVICE_METHOD_DEFINITION(LoaderAdvanced, stop)
{
//  if(params != empty_sequence) return ldr->stop(params);
  return unlock(params);
}

SERVICE_METHOD_DEFINITION(LoaderAdvanced, lock)
{
  lck.lock();
  return SERVICE_NULL;
}

SERVICE_METHOD_DEFINITION(LoaderAdvanced, unlock)
{
  lck.unlock();
  return SERVICE_NULL;
}

SERVICE_METHOD_DEFINITION(LoaderAdvanced, try_lock)
{
  lck.trylock();
  return SERVICE_NULL;
}

SERVICE_METHOD_DEFINITION(LoaderAdvanced, wait_unlock)
{
  lck.waitunlock();
  return SERVICE_NULL;
}
