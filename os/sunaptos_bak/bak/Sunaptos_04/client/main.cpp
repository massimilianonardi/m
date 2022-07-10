#include <stdio.h>

#include "object.h"
#include "loader.h"
#include "clientloader.h"

int main(int argc, char** argv)
{
  try
  {
    std::cout << "\n[client 00]\n";
    std::cout << "\n[client 00] " << argv[0];
    std::cout << "\n[client 00] " << argv[1] << " " << argv[2] << " " << argv[3] << " " << argv[4];
    char* server_name = argv[1];
    char* iface_srv_name = argv[2];
    char* ipc_server_key = argv[3];
    char* ipc_loader_key = argv[4];
    
//    Loader* loader = new ClientLoader(ipc_loader_key);
    ClientLoader* loader = new ClientLoader(ipc_loader_key);
    std::cout << "\n[client 01] ClientLoader...started";
    Object* obj = loader->getServiceLocal(server_name, IPCServer::generateKey());
    std::cout << "\n[client 02] Service...started";
    loader->makeServiceRemote(obj, iface_srv_name, ipc_server_key);
    std::cout << "\n[client 03] Service Stub...started";
    
    // wait until exit request
    std::cout << "\n[PRESS ANY KEY TO TERMINATE]\n";
    getchar();
    
    // cleanup sequence
    delete loader;
    delete obj;
  }
  catch(const char* msg)
  {
    printf(msg);
    getchar();
  }
  catch(...)
  {
    printf("undefined exception!");
    getchar();
  }

  return (0);
}
