#include <stdio.h>

#include "object.h"
#include "loader.h"
#include "clientloader.h"
#include "remoteloader.h"

#include "ipcclient.h"
#include "ipcserver.h"

#include "dlibobj.h"
#include "dlibcli.h"
#include "dlibsrv.h"

int main(int argc, char** argv)
{
  try
  {
    std::cout << "\n[client 00]\n";
    char* server_name = argv[1];
    char* iface_srv_name = argv[2];
    char* ipc_server_key = argv[3];
    char* ipc_loader_key = argv[4];
    
    Loader* loader = new ClientLoader(ipc_loader_key);
    std::cout << "\n[client 01]\n";
    
    DLibObj* dlibo = new DLibObj(server_name);
    std::cout << "\n[client 02]\n";
    Object* obj = dlibo->create(loader);
    std::cout << "\n[client 03]\n";
    
    DLibSrv* dlibs = new DLibSrv(iface_srv_name); // iface-srv-name passed from argv
    std::cout << "\n[client 04]\n";
    CommandListener* srv = dlibs->create(obj); // the only instance that this process will instantiate
    std::cout << "\n[client 05]\n";
    IPCServer* ipcs = new IPCServer(ipc_server_key, srv); // exclusive channel where the invoking process will send DT commands
    std::cout << "\n[client 06]\n";
    
    // wait until exit request
    std::cout << "\n[PRESS ANY KEY TO TERMINATE]\n";
    getchar();
    
    // cleanup sequence
    delete ipcs;
    delete srv;
    delete dlibs;
    
    delete obj;
    delete dlibo;
    
    delete loader;
  }
  catch(const char* msg)
  {
    printf(msg);
  }
  catch(...)
  {
    printf("undefined exception!");
  }
  
  return (0);
}
