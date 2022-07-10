#include "remoteloaderserver.h"
#include "ipcserver.h"
#include "dlibsrv.h"
#include <string>
#include <iostream>
using namespace std;

RemoteLoaderServer::RemoteLoaderServer(Loader* loader)
{
  std::cout << "\n[RemoteLoaderServer::RemoteLoaderServer]";

  // workaround to make RemoteLoaderServer act like a service
  // cl is needed when creating a new ipcs for the new server to connect
  // thus avoiding to create another RemoteLoaderServer instance
  // todo: remove the workaround with an architecture redesign
  DLibSrv* dlibs = new DLibSrv("RemoteLoader_srv.dlib");
  cl = dlibs->create(this);

  // call bootloader
  //loader->getService("BootLoader"); // NB loader is not connected to "this" object
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
  std::cout << "\n[RemoteLoaderServer::getInterface] start";
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

  const char* name;
  if(remote)
  {
#ifdef WIN32
//    string cmd = "client " + string(sn) + " " + string(ifn) + " " + string(key) + " " + string(lkey);
//    string cmd = "client " + string(sn) + ".dlib " + string(ifn) + "_srv.dlib " + string(key) + " " + string(lkey);
    string cmd = "start client " + string(sn) + ".dlib " + string(ifn) + "_srv.dlib " + string(key) + " " + string(lkey);
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

  return res;
}

Data* RemoteLoaderServer::getService(Data* data)
{
//  string srv = data->c();
//  string name = srv + "_srv.dlib";
//  srv = srv + ".dlib";
//
//  // generate key
//  const char* key = IPCServer::generateKey();
//
//  // generate loader key
//  const char* lkey = IPCServer::generateKey();
//
//  // workaround to make RemoteLoaderServer act like a service
//  // start new ipcs where the launched srv can connect
//  IPCServer* ipcs = new IPCServer(lkey, this->cl);
//  // add ipcs to list of active channels
//
//#ifdef WIN32
//  string cmd = "start client " + srv + " " + name + " " + string(key) + " " + string(lkey);
//#elif defined LINUX
//  // todo: exec
//#else
//#endif
//
//  std::cout << "\n[RemoteLoaderServer::getService] cmd = " << cmd.c_str();
//  int res = system(cmd.c_str());
//  std::cout << "\n[RemoteLoaderServer::getService] res = " << res;
//  std::cout << "\n[RemoteLoaderServer::getService] END";
  std::cout << "\n[RemoteLoaderServer::getService] START";
  return getInterface(data);
  std::cout << "\n[RemoteLoaderServer::getService] END";
}
