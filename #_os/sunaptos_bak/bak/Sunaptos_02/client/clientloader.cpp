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
  // todo: delete all objects contained into "services" and "services_remote" containers
  // todo: delete all active objects
  delete rl;
  delete dlibc;
  delete ipcc;
}

void ClientLoader::setSecurityManager(const char* name)
{
}

Object* ClientLoader::getInterface(const char* name)
{
  // call remote loader getservice
  // from result you know if to connect to a remote loader
  // or if to launch a local child dll-instantiated obj
  return 0;
}

Object* ClientLoader::getInterface(const char* name, const char* srv)
{
  // call remote loader getservice
  // from result you know if to connect to a remote loader
  // or if to launch a local child dll-instantiated obj
  // NB remote loader tells if you can load the requested srv, or another srv choosen by him
  DLibObj* dlibo = services[srv];
  if(dlibo == NULL)
  {
    dlibo = new DLibObj(srv);
    services[srv] = dlibo;
  }
  
  Object* obj = dlibo->create(this);
  // todo: add obj to the list of active objects
  
  return obj;
}

Object* ClientLoader::getService(const char* name)
{
  // call remote loader getservice
  // from result you know if to connect to a remote loader
  // or if to launch a local child dll-instantiated obj
  DLibObj* dlibo = services[name];
  if(dlibo == NULL)
  {
    dlibo = new DLibObj((string(name) + ".dlib").c_str());
    services[name] = dlibo;
  }

  Object* obj = dlibo->create(this);
  // todo: add obj to the list of active objects

  return obj;
}

Object* ClientLoader::getInterfaceRemote(const char* name)
{
  // todo: use an external kernel loader
  // call kl to ask for an instantiation
  // kl returns a key when the srv has fully launched, otherwise returns an error (-1)
  // a new ipcclient is instantiated and it connects to the ipcserver of the newly instantiated srv
  return 0;
}

Object* ClientLoader::getInterfaceRemote(const char* name, const char* srv)
{
  // call remote loader getservice
  // from result you know if to connect to a remote loader
  // or if to launch a local child dll-instantiated obj
  // NB remote loader tells if you can load the requested srv, or another srv choosen by him
  
  // todo: to revise
  DLibCli* dlibc = services_remote[srv];
  if(dlibc == NULL)
  {
    //dlibc = new DLibCli(name); // NB here is loaded the iface wrapper which is common to all srv implementing that iface
    dlibc = new DLibCli(srv); // NB here is loaded srv for test purposes only
    services_remote[srv] = dlibc;
  }
  std::cout << "ClientLoader::getInterfaceRemote - srv wrapper loaded";
  
  // todo: if any other process has already instantiated it, this process cannot be aware of it 
  // that's why a remote loader is needed, but for this implementation things are simple and i don't 
  // care of any other instances initiated by other processes -> this means that "real services" in this 
  // implementation are not possible!
  
  // todo: replace the following direct instantiation with a delegate instantiation via a remote loader/instancesmanager
  //const char* key = IPCServer::generateKey(); // todo: make a correct implementation of key generation
  const char* key = "k1"; // todo: make a correct implementation of key generation
  // todo: launch another client and wait for it to be ready for ipc
  string cmd = "client " + string(srv) + " " + string(name) + " " + string(key) + " loader_key_fake_001";
  //string cmd = "client " + srv + " " + name + " " + key + " " + loader_key;
  std::cout << "ClientLoader::getInterfaceRemote - cmd = " << cmd.c_str();
#ifdef WIN32
  STARTUPINFO si;
  PROCESS_INFORMATION pi;
  if(!CreateProcess(NULL, (char*) cmd.c_str(), NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi))
  {
    // todo: error
  }
#elif defined LINUX
  // todo: exec
#else
#endif
  
  // todo: try to connect polling with a fake key (when ita returns with an error it means, the srv has initialized)
  // if a configured timeout has passed, then call a user interface procedure to ask if to wait or fail
  // with an external kernel loader the above is managed by the kl
#ifdef WIN32
  Sleep(3000);
  std::cout << "ClientLoader::getInterfaceRemote - srv remotely launched";
#elif defined LINUX
  // todo: sleep
#else
#endif
  
  IPCClient* ipcc = new IPCClient(key);
  std::cout << "ClientLoader::getInterfaceRemote - ipcc created";
  ipcc->connect();
  std::cout << "ClientLoader::getInterfaceRemote - ipcc connected";
  Object* obj = dlibc->create(ipcc);
  std::cout << "ClientLoader::getInterfaceRemote - srv wrapper created";
  // todo: add obj to the list of active objects
  
  return obj;
}

Object* ClientLoader::getServiceRemote(const char* name)
{
  // ask kl for instantiation, it will return the key or null if timeout or any other error
  Data* nd = new Data(Data::tc, sizeof(name), (void*) name);
  Data* res = rl->getService(nd);
  // question: if i copy an object through shared memory what will happen? maybe any even nested presence of pointers will make it crash...
  // todo: extract key from res
  const char* key = res->c();

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

  objects[key] = obj;

  return obj;
}
