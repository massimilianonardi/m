#include "clientloader.h"
#include "ipcclient.h"
#include "ipcserver.h"

ClientLoader::ClientLoader(const char* ipc_loader_key)
{
  ipcc = new IPCClient(ipc_loader_key); // connection params received from argv to connect to the Loader that has launched this process
  ipcc->connect();
  dlibc = new DLibCli("RemoteLoader_cli.dlib");
  rl = dynamic_cast<RemoteLoader*>(dlibc->create(ipcc));
}

ClientLoader::~ClientLoader()
{
  // todo: delete all objects contained into "services" and "services_remote" containers and key strings
  // todo: delete all active objects
  // todo: call rl to delete all objs instantiated by this process
  delete rl;
  delete dlibc;
  delete ipcc;
}

Object* ClientLoader::getInterface(const char* ifn, const char* sn, bool remote)
{
  std::cout << "\n[ClientLoader::getInterface] ifn = " << ifn << " sn = " << sn << " remote = " << remote;
  Sleep(5000);
  // todo: implement
  // params = new Data with params:ifn,sn,remote
  // call r = rl->getInterface(d);
  // unpack r:
  // int result (0 = ok, or errorcode)
  // bool remote_ack (if above ok, if false instantiate locally, if true instantiate cli-wrapper)
  // char name (if above is false it's the name of local srv to instantiate, otherwise is the name of the local wrapper
  // char key (if remote_ack is the key for ipcc to connect to remote srv, otherwise is a unique id to identify the new instance)

  Data* params = new Data();
  params->put(new DataString(ifn)); // interface name
  params->put(new DataString(sn)); // service name
  params->put(new DataNumber(remote)); // flag remote (boolean)

//  Data* res = rl->getService(params);
  Data* res = rl->getInterface(params);
  int result = res->getn(0)->geti();
  bool remote_ack = res->getn(1)->getb();
  const char* key = res->gets(2)->get();
  const char* name = res->gets(3)->get();
  std::cout << "\n[ClientLoader::getInterface] result = " << result << " remote_ack = " << remote_ack << " key = " << key << " name = " << name;
  Sleep(5000);

//  int result = 0;
//  bool remote_ack = false;
//  const char* name = 0;
//  const char* key = 0;

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

Object* ClientLoader::getServiceLocal(const char* name, const char* id)
{
  string srv_name = name + string(".dlib");
  DLibObj* dlibo = services[name];
  if(dlibo == 0)
  {
    dlibo = new DLibObj(srv_name.c_str());
    services[name] = dlibo;
  }
  Object* obj = dlibo->create(this);

  objects[id] = obj; // NB remoteloader gave key as unique id for this new instance of name

  return obj;
}

Object* ClientLoader::getServiceRemote(const char* name, const char* key)
{
  string srv_name = name + string("_cli.dlib");
  DLibCli* dlibc = services_remote[name];
  if(dlibc == 0)
  {
    dlibc = new DLibCli(srv_name.c_str());
    services_remote[name] = dlibc;
  }

  IPCClient* ipcc = new IPCClient(key);
  ipcc->connect();
  Object* obj = dlibc->create(ipcc);

  objects_remote[key] = obj;

  return obj;
}
