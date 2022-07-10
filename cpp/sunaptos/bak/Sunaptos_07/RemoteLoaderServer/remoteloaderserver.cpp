#include "remoteloaderserver.h"
#include <iostream>

RemoteLoaderServer::RemoteLoaderServer(Loader* loader)
{
  std::cout << "\n[RemoteLoaderServer::RemoteLoaderServer] ";
  std::cout << "\n[RemoteLoaderServer::RemoteLoaderServer] START";

  // workaround to make RemoteLoaderServer act like a service
  // cl is needed when creating a new ipcs for the new server to connect
  // thus avoiding to create another RemoteLoaderServer instance
  // todo: remove the workaround with an architecture redesign

//  DLibSrv* dlibs = new DLibSrv("RemoteLoader_srv.dlib");
//  cl = dlibs->create(this);
  cl = dlm::instance().createsrv("RemoteLoader", this);

  // call bootloader
  Sequence params, res;
  params(0) = "BootLoader";
  params(1) = "BootLoaderServer";
  params(2) = true;
  res = getInterface(params, res); // no need to do anything else with the bootloader obj

  std::cout << "\n[RemoteLoaderServer::RemoteLoaderServer] END";
}

RemoteLoaderServer::~RemoteLoaderServer()
{
  std::cout << "\n[RemoteLoaderServer::~RemoteLoaderServer] ";
}

Sequence& RemoteLoaderServer::getInterface(Sequence& params, Sequence& res)
{
  std::cout << "\n[RemoteLoaderServer::getInterface] ";
  std::cout << "\n[RemoteLoaderServer::getInterface] START";

  const char* ifn = params(0);
  const char* sn = params(1);
  bool remote = params(2);
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

  res(0) = result;
  res(1) = remote_ack;
  res(2) = key;
  res(3) = name;

  std::cout << "\n[RemoteLoaderServer::getInterface] END";
  return res;
}

Sequence& RemoteLoaderServer::getService(Sequence& params, Sequence& res)
{
  std::cout << "\n[RemoteLoaderServer::getService] ";
  return getInterface(params, res);
}

Sequence& RemoteLoaderServer::setLoaderListener(Sequence& params, Sequence& res)
{
  std::cout << "\n[RemoteLoaderServer::setLoaderListener] ";
  const char* key = params(0);
  const char* lkey = params(1); // id
  std::cout << "\n[RemoteLoaderServer::setLoaderListener] 01";
  IPCClient* ipcc = new IPCClient(key); // memory leak
  ipcc->connect();
  std::cout << "\n[RemoteLoaderServer::setLoaderListener] 02";
  ServiceStarter* s = dynamic_cast<ServiceStarter*>(dlm::instance().createcli("ServiceStarter", ipcc));
  std::cout << "\n[RemoteLoaderServer::setLoaderListener] 03";
  ss[lkey] = s;

  // TEST START
  const char* ckey = IPCServer::generateKey();
  Sequence p;
  p(0) = ckey;
  s->createServiceChannel(p, res);
  // TEST END

  std::cout << "\n[RemoteLoaderServer::setLoaderListener] 04";
  res(0) = true;
  std::cout << "\n[RemoteLoaderServer::setLoaderListener] 05";

  return res;
}
