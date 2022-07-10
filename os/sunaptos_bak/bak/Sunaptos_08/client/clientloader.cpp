#include "clientloader.h"
#include "singletons.h"
#include "ipcclient.h"
#include "ipcserver.h"
#include <string>
#include <iostream>
#include "sequence.h"

ClientLoader::ClientLoader()
{
}

ClientLoader::~ClientLoader()
{
  // todo: delete all objects contained into "services" and "services_remote" containers and key strings
  // todo: delete all active objects
  // todo: call rl to delete all objs instantiated by this process
  delete obj;
  delete rl;
}

void ClientLoader::init(const char* lkey, const char* name, const char* iface, const char* key)
{
  iface_name = iface;

  rl = dynamic_cast<RemoteLoader*>(getServiceRemote("RemoteLoader", lkey));
  obj = getServiceLocal(name, "id_0");

  // the following only if requested by command line, in future versions it will be removed and replaced with
  // the ability of remoteloader to ask clients to start new server connections (this is true service implementation)
  // thus one-on-one connections is only a particular case
  createServiceRemoteChannel(obj, iface, key);

  // connect back to rl to act as a listener to instantiate srv-wrappers
  // start srv-wrapper on clientloader -> cl_key
//  if(rl)
//  {
//    std::cout << "\n[ClientLoader::init] setLoaderListener START";
//    const char* cl_key = IPCServer::generateKey();
//    createServiceRemoteChannel(this, "ServiceStarter", cl_key);
//    Data* pd = new Data();
//    pd->put(new DataString(cl_key));
//    pd->put(new DataString(lkey)); // id
//    rl->setLoaderListener(pd);
//    std::cout << "\n[ClientLoader::init] setLoaderListener OK!";
//  }
//  else
//  {
//    std::cout << "\n[ClientLoader::init] setLoaderListener rl = 0";
//  }
}

Object* ClientLoader::getInterface(const char* ifn, const char* sn, bool remote)
{
  std::cout << "\n[ClientLoader::getInterface] ifn = " << ifn << " sn = " << sn << " remote = " << remote;
  // todo: implement
  // params = new Data with params:ifn,sn,remote
  // call r = rl->getInterface(d);
  // unpack r:
  // int result (0 = ok, or errorcode)
  // bool remote_ack (if above ok, if false instantiate locally, if true instantiate cli-wrapper)
  // char name (if above is false it's the name of local srv to instantiate, otherwise is the name of the local wrapper
  // char key (if remote_ack is the key for ipcc to connect to remote srv, otherwise is a unique id to identify the new instance)

  Sequence params;
  params << ifn << sn << remote;
  
//  std::cout << "\n[ClientLoader::getInterface] 01";
  Sequence res;
  res = rl->getInterface(params, res);
//  std::cout << "\n[ClientLoader::getInterface] 02";

  int result = res[0];
  bool remote_ack = res[1];
  const char* key = res(2);
  const char* name = res(3);
  
  std::cout << "\n[ClientLoader::getInterface] result = " << result << " remote_ack = " << remote_ack << " key = " << key << " name = " << name;

  if(result == 0)
  {
    if(remote_ack)
    {
      return getServiceRemote(name, key);
    }
    else
    {
      return getServiceLocal(name, key);
    }
  }
  else
  {
    // todo: throw an exception
    std::cout << "\n[ClientLoader::getInterface] RemoteLoader ERROR, code = " << result;
    Sleep(5000);
    throw "ERROR";
  }
}

Object* ClientLoader::getService(const char* sn, bool remote)
{
  return getInterface("", sn, remote);
}

Sequence& ClientLoader::createServiceChannel(Sequence& params, Sequence& res)
{
  std::cout << "\n[ClientLoader::createServiceChannel] 01";
  const char* key = (const char*) params(0);

  std::cout << "\n[ClientLoader::createServiceChannel] 02";
  createServiceRemoteChannel(obj, iface_name, key);
  std::cout << "\n[ClientLoader::createServiceChannel] 03";
//  res(0) = true;
//  res.put<bool>(true, (number) 0);
  std::cout << "\n[ClientLoader::createServiceChannel] 04";
  
  return res;
}

Object* ClientLoader::getServiceLocal(const char* name, const char* id)
{
  Object* obj = dlm::instance().createobj(name, this);

  return obj;
}

Object* ClientLoader::getServiceRemote(const char* name, const char* key)
{
  IPCClient* ipcc = new IPCClient(key);
  bool res = ipcc->connect();

  Object* obj = 0;
  if(res)
  {
    obj = dlm::instance().createcli(name, ipcc);
  }

  return obj;
}

void ClientLoader::createServiceRemoteChannel(Object* obj, const char* name, const char* key)
{
  CommandListener* srv = dlm::instance().createsrv(name, obj);

  IPCServer* ipcs = new IPCServer(key, srv);
}
