#include "clientloader.h"
#include "singletons.h"
#include "ipcclient.h"
#include "ipcserver.h"
#include "sequenceomogeneus.h"
#include <string>
#include <iostream>

ClientLoader::ClientLoader()
{
  std::cout << "\n01";
  Sequence seq(8);
  seq << (int) 20;
  seq << (bool) true;
  seq << "test string";
//  seq << new Sequence() << 5 << 6.2;
  std::cout << "\n02";

  int n = seq^0;
  bool b = seq^1;
  Sequence ss = seq|2;
  std::cout << "\n02b";
  std::cout << "\n02c " << (long) ss.size();
  std::cout << "\n02d";
  int i = seq|2^0;
  std::cout << "\n02e " << i;
//  int i = ss^0;
//  const char* str = seq|2;
//  long i = seq|3^0;
//  long j = seq|3^1;

  std::cout << "\n n = " << n;
  std::cout << "\n b = " << b;
//  std::cout << "\n str = " << str;
//  std::cout << "\n i = " << i;
//  std::cout << "\n j = " << j;
  std::cout << "\n03";
}

ClientLoader::~ClientLoader()
{
  // todo: delete all objects contained into "services" and "services_remote" containers and key strings
  // todo: delete all active objects
  // todo: call rl to delete all objs instantiated by this process
  delete obj;
  delete rl;
}

void ClientLoader::init(const char* lkey, const char* name, const char* iface, const char* key)
{
  iface_name = iface;

  rl = dynamic_cast<RemoteLoader*>(getServiceRemote("RemoteLoader", lkey));
  obj = getServiceLocal(name, "id_0");

  // the following only if requested by command line, in future versions it will be removed and replaced with
  // the ability of remoteloader to ask clients to start new server connections (this is true service implementation)
  // thus one-on-one connections is only a particular case
  createServiceRemoteChannel(obj, iface, key);

  // connect back to rl to act as a listener to instantiate srv-wrappers
  // start srv-wrapper on clientloader -> cl_key
//  if(rl)
//  {
//    std::cout << "\n[ClientLoader::init] setLoaderListener START";
//    const char* cl_key = IPCServer::generateKey();
//    createServiceRemoteChannel(this, "ServiceStarter", cl_key);
//    Data* pd = new Data();
//    pd->put(new DataString(cl_key));
//    pd->put(new DataString(lkey)); // id
//    rl->setLoaderListener(pd);
//    std::cout << "\n[ClientLoader::init] setLoaderListener OK!";
//  }
//  else
//  {
//    std::cout << "\n[ClientLoader::init] setLoaderListener rl = 0";
//  }
}

Object* ClientLoader::getInterface(const char* ifn, const char* sn, bool remote)
{
  std::cout << "\n[ClientLoader::getInterface] ifn = " << ifn << " sn = " << sn << " remote = " << remote;
  // todo: implement
  // params = new Data with params:ifn,sn,remote
  // call r = rl->getInterface(d);
  // unpack r:
  // int result (0 = ok, or errorcode)
  // bool remote_ack (if above ok, if false instantiate locally, if true instantiate cli-wrapper)
  // char name (if above is false it's the name of local srv to instantiate, otherwise is the name of the local wrapper
  // char key (if remote_ack is the key for ipcc to connect to remote srv, otherwise is a unique id to identify the new instance)

  Sequence params;
//  seqseq params;
//  num8seq ifns, sns, rs;
//  ifns = ifn;
//  sns = sn;
//  rs << remote;

//  params << num8seq((num8*) ifn);
//  params << num8seq((num8*) sn);
//  params << num8seq(remote);

//  params << new num8seq() << (num8*) ifn;
//  params << new num8seq() << (num8*) sn;
//  params << new num8seq() << (num8) remote;

//  num8seq* ifns = new num8seq();
//  *ifns << (num8*) ifn;
//  Sequence* sns = new Sequence();
//  *sns << sn;

//  params(0) = ifns;
//  params(1) = sns;
//  params(2) = rs;

  Sequence* ifns = new Sequence();
  ifns->copy(ifn, string(ifn).size());

  Sequence* sns = new Sequence();
  sns->copy(sn, string(sn).size());
  
  Sequence* nns = new Sequence();
  nns->put(remote, 0);

  params.put(ifns, 0);
  params.put(sns, 1);
  params.put(nns, 2);
  
  std::cout << "\n[ClientLoader::getInterface] 01";
  Sequence res = rl->getInterface(params, res);
  std::cout << "\n[ClientLoader::getInterface] 02";
//  int r;
//  int result = res(0, r);
//  int result = res.gse<int>((number) 0, r);
//  int result = gse<int>(res, (number) 0);
//  int result = res|(number) 0|(number) 0;
//  bool remote_ack = res|0|1;
//  const char* key = res|1;
//  const char* name = res|2;
//  int result = *(int*) res(0);
//  bool remote_ack = *(bool*) res(1);
//  const char* key = (const char*) res(2);
//  const char* name = (const char*) res(3);

//  int result = res.get<Sequence*>(0)->get<int>(0);
//  bool remote_ack = res.get<Sequence*>(1)->get<bool>(0);
//  const char* key = res.get<Sequence*>(2)->get<const char>();
//  const char* name = res.get<Sequence*>(3)->get<const char>();

//  int result = res(0)[0];
//  bool remote_ack = res(1)[0];
//  const char* key = res(2);
//  const char* name = res(3);

  int result = res|0^0; // element 0 is explicitly addressed and returned as number
  bool remote_ack = res|1; // this is a seq whose element 0 is casted to bool
  const char* key = res|2;
  const char* name = res|3;

//  key <<= res|2;
//  char* name2 <<= (res|3);
//  char* name3 | res ^ 3; // | ^ & res^3^2^4
//  char* name2 = res(3);
//  char* name3 = res|3;
  
  std::cout << "\n[ClientLoader::getInterface] result = " << result << " remote_ack = " << remote_ack << " key = " << key << " name = " << name;

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

Sequence& ClientLoader::createServiceChannel(Sequence& params, Sequence& res)
{
  std::cout << "\n[ClientLoader::createServiceChannel] 01";
  const char* key = (const char*) params(0);

  std::cout << "\n[ClientLoader::createServiceChannel] 02";
  createServiceRemoteChannel(obj, iface_name, key);
  std::cout << "\n[ClientLoader::createServiceChannel] 03";
//  res(0) = true;
//  res.put<bool>(true, (number) 0);
  std::cout << "\n[ClientLoader::createServiceChannel] 04";
  
  return res;
}

Object* ClientLoader::getServiceLocal(const char* name, const char* id)
{
  Object* obj = dlm::instance().createobj(name, this);

  return obj;
}

Object* ClientLoader::getServiceRemote(const char* name, const char* key)
{
  IPCClient* ipcc = new IPCClient(key);
  bool res = ipcc->connect();

  Object* obj = 0;
  if(res)
  {
    obj = dlm::instance().createcli(name, ipcc);
  }

  return obj;
}

void ClientLoader::createServiceRemoteChannel(Object* obj, const char* name, const char* key)
{
  CommandListener* srv = dlm::instance().createsrv(name, obj);

  IPCServer* ipcs = new IPCServer(key, srv);
}
