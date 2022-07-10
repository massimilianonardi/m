#include "remoteloaderserver.h"
#include "ipcserver.h"
#include "dlibsrv.h"
#include <string>
#include <iostream>
using namespace std;

RemoteLoaderServer::RemoteLoaderServer(Loader* loader)
{
  std::cout << "\n[RemoteLoaderServer::RemoteLoaderServer]";

  DLibSrv* dlibs = new DLibSrv("RemoteLoader_srv.dlib");
  this->cl = dlibs->create(this);

  // call bootloader
  //loader->getService("BootLoader"); // NB loader is not connected to "this" object
  const char* name = "BootLoaderServer";
  Data* nd = new Data(Data::tc, sizeof(name), (void*) name);
  this->getService(nd);
  std::cout << "\n[RemoteLoaderServer::RemoteLoaderServer] END";
}

RemoteLoaderServer::~RemoteLoaderServer()
{
  std::cout << "\n[RemoteLoaderServer::~RemoteLoaderServer]";
  // todo: close and delete all active ipcs channels
}

Data* RemoteLoaderServer::getInterface(Data* data)
{
  std::cout << "\n[RemoteLoaderServer::getInterface] " << (char*) data;
  return 0;
}

Data* RemoteLoaderServer::getService(Data* data)
{
  string srv = data->c();
  string name = srv + "_srv.dlib";
  srv = srv + ".dlib";

  // generate key
  const char* key = IPCServer::generateKey();

  // generate loader key
  const char* lkey = IPCServer::generateKey();

  // start new ipcs where the launched srv can connect
  IPCServer* ipcs = new IPCServer(lkey, this->cl);

  // add ipcs to list of active channels

#ifdef WIN32
  // wait for ipcs to initialize
//  Sleep(3000);
//  STARTUPINFO si;
//  PROCESS_INFORMATION pi;
//  if(!CreateProcess(NULL, (char*) cmd.c_str(), NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi))
//  {
//    // todo: error
//    std::cout << "\n[RemoteLoaderServer::getService] ERROR!!!";
//  }
  string cmd = "start client " + srv + " " + name + " " + string(key) + " " + string(lkey);
#elif defined LINUX
  // todo: exec
#else
#endif

  std::cout << "\n[RemoteLoaderServer::getService] cmd = " << cmd.c_str();
  int res = system(cmd.c_str());
  std::cout << "\n[RemoteLoaderServer::getService] res = " << res;

  // try to connect the ipcc to the launched srv until it succeded or timeout
  // if ok disconnect else error
  // return key
  std::cout << "\n[RemoteLoaderServer::getService] END";
  return 0;
}
