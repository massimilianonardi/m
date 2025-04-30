#include "clientloader.h"
#include "ipcclient.h"
#include "ipcserver.h"

ClientLoader::ClientLoader(const char* ipc_loader_key)
{
  // call setSecurityManager to make CL instantiate the SecurityManager-client-wrapper and use it to
  // make loading of srvs/libs conditioned by security policies
  // NB: in the current version cl acts by itself and doesn't call/connect to any external KernelLoader to
  //     know if it can istantiate locally by itself, or kl instantiate remotely according to current policies.
  //     in the final version cl is only a wrapper and kl instantiate remotely and locally by injecting dll into the process.
}

ClientLoader::~ClientLoader()
{
  // todo: delete all objects contained into "services" and "services_remote" containers
  // todo: delete all active objects
}

void ClientLoader::setSecurityManager(const char* name)
{
}

Object* ClientLoader::getInterface(const char* name)
{
  return 0;
}

Object* ClientLoader::getInterface(const char* name, const char* srv)
{
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
  return 0;
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
  return 0;
}
