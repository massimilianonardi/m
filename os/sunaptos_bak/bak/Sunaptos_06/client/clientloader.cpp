#include "clientloader.h"
#include "singletons.h"
#include "ipcclient.h"
#include "ipcserver.h"
#include <string>
#include <iostream>

#include "number.h"
#include "sequenceomogeneus.h"

ClientLoader::ClientLoader()
{
//  NumericType n;
//  n.l = (long) 123;
//  std::cout << "\ntest 1 " << n.l;
//  std::cout << "\ntest 2 " << n.f;
//
//  Number m;
//  m.get().b = true;
//  std::cout << "\ntest 3 " << m.get().b;
//  std::cout << "\ntest 4 " << m.get().l;
//  m.get().ll = 5 + 19;
//  m.get().d = 5 + 19;
//  std::cout << "\ntest 5 " << m.get().b;
//  std::cout << "\ntest 6 " << m.get().l;
//  std::cout << "\ntest 7 " << m.get().d;
//  m.get().d = 6.9;
//  std::cout << "\ntest 8 " << m.get().d;
//  m.get().d = 123.456;
//  std::cout << "\ntest 9 " << m.get().d;
//  Number num(9);
//  std::cout << "\nnum = " << num.get();
//  Number l, k, h;
//  l = 2;
//  h = l;
//  l++;
//  ++l;
//  k = 3;
//  h = l++;
//  h = ++l;
//  int i = 5;
//  int j = (++i)++;
//  h = (++l++);
//  std::cout << "\nnum = " << l.get();
//  std::cout << "\nnum = " << k.get();
//  std::cout << "\nnum = " << h.get();
//
//  std::cout << "\nsizeof(int) " << sizeof(int);
//  std::cout << "\nsizeof(long int) " << sizeof(long int);
//  std::cout << "\nsizeof(long long int) " << sizeof(long long int);
//  std::cout << "\nsizeof(double) " << sizeof(double);
//  std::cout << "\nsizeof(long double) " << sizeof(long double);
//  std::cout << "\nsizeof(NumericType) " << sizeof(NumericType);
//
//  typedef unsigned char bigchar[sizeof(long)];
//  bigchar bc;
//  long bcl = (long) bc;
//  bcl++;
//  std::cout << "\nbcl " << bcl;
//  int sz = l.get();
//  sz = 5;
//  long long a[sz];
//  std::cout << "\nsizeof(a[]) " << sizeof(a);

  numseq ns;
//  SequenceOmogeneus<double> ns;
  std::cout << "\nsequence: " << ns.size();
  ns.resize(2);
  number n = ns(0);
  std::cout << "\nsequence: " << n;
  number m = ns(1);
  std::cout << "\nsequence: " << m;
//  number k = ns(2);
//  std::cout << "\nsequence: " << k;
  ns(0) = 5;
  std::cout << "\nsequence: " << n;
  std::cout << "\nsequence: " << ns(0);
  std::cout << "\nsequence: " << ns.size();
  Sequence* seq = &ns;
  std::cout << "\nsequence: " << seq->size();
  numseq ns2;
  ns2 << *seq;
  std::cout << "\nsequence2: " << ns2(0);
  numseq ns3;
  ns3 << seq;
  std::cout << "\nsequence3: " << ns3(0);
  numseq ns4;
  ns4 = *seq;
  std::cout << "\nsequence4: " << ns4(0);
  numseq ns5;
  ns5 = seq;
  std::cout << "\nsequence5: " << ns5(0);
//  seqseq ss;
//  ss << *seq;
//  std::cout << "\nsequence: test";
//  std::cout << "\nsequence: " << ss(0);
//  int asd[5];
//  asd[6] = 1;
//  std::cout << "\nsequence: " << asd[6];
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

  Data* params = new Data();
  params->put(new DataString(ifn)); // interface name
  params->put(new DataString(sn)); // service name
  params->put(new DataNumber(remote)); // flag remote (boolean)

  std::cout << "\n[ClientLoader::getInterface] 01";
  Data* res = rl->getInterface(params);
  std::cout << "\n[ClientLoader::getInterface] 02";
  int result = res->getn(0)->geti();
  bool remote_ack = res->getn(1)->getb();
  const char* key = res->gets(2)->get();
  const char* name = res->gets(3)->get();
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

Data* ClientLoader::createServiceChannel(Data* data)
{
  std::cout << "\n[ClientLoader::createServiceChannel] 01";
  const char* key = data->gets(0)->get();

  std::cout << "\n[ClientLoader::createServiceChannel] 02";
  createServiceRemoteChannel(obj, iface_name, key);
  std::cout << "\n[ClientLoader::createServiceChannel] 03";
  Data* res = new Data();
  res->put(new DataNumber(true));
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
