#include "LoaderAdvanced.h"

#include "functions.h"

// TODO: not manage itself the processes, but export interfaces to allow a more complex loader to do the management using this loader features
// TODO: ufn support
// TODO: services instantiation path detection and management
// TODO: security manager
// TODO: config with events mechanism
// TODO: params structure
// TODO: LoaderLocal, LoaderProcess, LoaderNetwork (ll, lp and ln only perform low level create and destroy, not management), LoaderManager (manages all instances)
// TODO: LoaderManager tries to connect to a central master instance...boot takes care of the connection params of master and all children
// TODO: do the above by means of LoaderAdvenced (connect to a central unique instance)
LoaderAdvanced::LoaderAdvanced(SERVICE_METHOD_PARAMETERS)
{
  stream_dlib = new ServiceLoader("ServiceStreamer");
  lck.lock();
}

LoaderAdvanced::~LoaderAdvanced()
{
  debug_line
  delete stream_dlib;
}

SERVICE_REGISTER(LoaderAdvanced)
SERVICE_REGISTER_END

SERVICE_METHOD_DEFINITION(LoaderAdvanced, create)
{
  // params
  Sequence srv_params = (const char*) params;
  srv_params() << generateKey();
  srv_params() << generateKey();
  srv_params() << generateKey();
  if(0 < params.size()) srv_params() << params(0);
  
  // server. destroyed in this call after notify unlocks the lock.
  Service* ssrv = stream_dlib->create(Sequence((const char*) srv_params(0))() << (Service*) this);
  
  // launch
  std::string cmd = "./process LoaderServer \"";
  cmd += std::string(srv_params.to_text()) + "\"";
  debug(cmd.c_str())
  systemLaunch(cmd.c_str());
  
  // wait
  Lock* l = new Lock();
  l->lock();
  lm[(char*) srv_params(0)] = l;
  l->waitunlock();
  delete l;
  
  // delete server
  stream_dlib->destroy(ssrv);
  
  // client. destroied with explicit call to destroy.
  Service* srv = stream_dlib->create(srv_params(1));
  
  // map client to LoaderServer. destroied contextually with the client.
  rldr_map[srv] = stream_dlib->create(srv_params(2));
  
  // return client
  return srv;
}

SERVICE_METHOD_DEFINITION(LoaderAdvanced, destroy)
{
  debug_line
  Service* srv = params;
  delete srv;
  Service* rsrv = rldr_map[srv];
//  rsrv->destroy(empty_sequence);
  rsrv->stop(empty_sequence);
  rldr_map.erase(srv);
  delete rsrv;
  debug_line
  return SERVICE_NULL;
}

SERVICE_METHOD_DEFINITION(LoaderAdvanced, notify)
{
  Sequence res;
  Lock* l = lm[(const char*) params];
  l->unlock();
  lm.erase((const char*) params);
  return SERVICE_NULL;
}

SERVICE_METHOD_DEFINITION(LoaderAdvanced, stop)
{
  // TODO: check if remote srv is to be stopped
//  if(params != empty_sequence) return ldr->stop(params);
//  return unlock(params);
  return loader.stop(empty_sequence);
}

//SERVICE_METHOD_DEFINITION(LoaderAdvanced, lock)
//{
//  lck.lock();
//  return SERVICE_NULL;
//}
//
//SERVICE_METHOD_DEFINITION(LoaderAdvanced, unlock)
//{
//  lck.unlock();
//  return SERVICE_NULL;
//}
//
//SERVICE_METHOD_DEFINITION(LoaderAdvanced, try_lock)
//{
//  lck.trylock();
//  return SERVICE_NULL;
//}

SERVICE_METHOD_DEFINITION(LoaderAdvanced, wait_unlock)
{
  lck.waitunlock();
  return SERVICE_NULL;
}
