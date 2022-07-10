#include <stdio.h>

#include "object.h"
#include "loader.h"
#include "clientloader.h"

#include "ipcclient.h"
#include "ipcserver.h"

#include "dlibobj.h"
#include "dlibcli.h"
#include "dlibsrv.h"

int main(int argc, char** argv)
{
  try
  {
    char* server_name = argv[1];
    char* iface_srv_name = argv[2];
    char* ipc_server_key = argv[3];
    char* ipc_loader_key = argv[4];
    
    // the following is when loader is totally external and it can load dll into foreign processes...difficult!
    //IPCClient* ipcc = new IPCClient(argv[4]); // connection params received from argv to connect to the Loader that has launched this process
    //DLibCli* dlibc = new DLibCli("Loader-cli.dlib");
    //Loader* loader = dynamic_cast<Loader*>(dlibc->create(ipcc));
    
    Loader* loader = new ClientLoader(ipc_loader_key);
    std::cout << "01";
    
    DLibObj* dlibo = new DLibObj(server_name);
    std::cout << "02";
    Object* obj = dlibo->create(loader);
    std::cout << "03";
    
    DLibSrv* dlibs = new DLibSrv(iface_srv_name); // iface-srv-name passed from argv
    std::cout << "04";
    CommandListener* srv = dlibs->create(obj); // the only instance that this process will instantiate
    std::cout << "05";
    IPCServer* ipcs = new IPCServer(ipc_server_key, srv); // exclusive channel where the invoking process will send DT commands
    std::cout << "06";
    
    // wait until exit request
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
