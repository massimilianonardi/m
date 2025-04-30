#include "remoteloaderserver.h"
#include "ipcserver.h"
#include "dlibsrv.h"
#include <string>
#include <iostream>
using namespace std;

RemoteLoaderServer::RemoteLoaderServer(Loader* loader)
{
  std::cout << "\n[RemoteLoaderServer::RemoteLoaderServer] START";

  // workaround to make RemoteLoaderServer act like a service
  // cl is needed when creating a new ipcs for the new server to connect
  // thus avoiding to create another RemoteLoaderServer instance
  // todo: remove the workaround with an architecture redesign
  DLibSrv* dlibs = new DLibSrv("RemoteLoader_srv.dlib");
  cl = dlibs->create(this);

  // call bootloader
  Data* params = new Data();
  params->put(new DataString("BootLoader")); // interface name
  params->put(new DataString("BootLoaderServer")); // service name
  params->put(new DataNumber(true)); // flag remote (boolean)
  Data* res = getInterface(params); // no need to do anything else with the bootloader obj

  std::cout << "\n[RemoteLoaderServer::RemoteLoaderServer] END";
}

RemoteLoaderServer::~RemoteLoaderServer()
{
  std::cout << "\n[RemoteLoaderServer::~RemoteLoaderServer]";
  // todo: close and delete all active ipcs channels and lkey strings
}

Data* RemoteLoaderServer::getInterface(Data* data)
{
  std::cout << "\n[RemoteLoaderServer::getInterface] START";

  const char* ifn = data->gets(0)->get();
  const char* sn = data->gets(1)->get();
  bool remote = data->getn(2)->getb();
  std::cout << "\n[RemoteLoaderServer::getInterface] ifn = " << ifn << " sn = " << sn << " remote = " << remote;

  int result = 0;
  bool remote_ack = remote;
  const char* key = IPCServer::generateKey();
  const char* lkey = IPCServer::generateKey();
  
  // start another ipcs with lkey to listen for new srv => multithread, or give the same current key => single thread!
  IPCServer* ipcs = new IPCServer(lkey, cl);
  // add new ipcs to list of current active connections
  cc[lkey] = ipcs;

  const char* name = ifn;
  if(remote)
  {
#ifdef WIN32
    string cmd = "start client " + string(sn) + " " + string(ifn) + " " + string(key) + " " + string(lkey);
    std::cout << "\n[RemoteLoaderServer::getInterface] cmd = " << cmd;
#elif defined LINUX
  // todo: linux code
#else
#endif
    result = system(cmd.c_str());
    std::cout << "\n[RemoteLoaderServer::getInterface] result = " << result;
    name = ifn;
  }
  else
  {
    name = sn;
  }

  Data* res = new Data();
  res->put(new DataNumber(result));
  res->put(new DataNumber(remote_ack));
  res->put(new DataString(key));
  res->put(new DataString(name));

  std::cout << "\n[RemoteLoaderServer::getInterface] END";
  return res;
}

Data* RemoteLoaderServer::getService(Data* data)
{
  std::cout << "\n[RemoteLoaderServer::getService]";
  return getInterface(data);
}
