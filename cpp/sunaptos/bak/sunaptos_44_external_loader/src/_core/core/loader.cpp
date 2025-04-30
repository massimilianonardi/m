#include "loader.h"

#include <string>

#include "singletons.h"
#include "functions.h"
#include "servicesequence.h"
#include "serviceserver.h"
#include "serviceclient.h"

//Loader::Loader()
//{
//}
//
//Loader::~Loader()
//{
//}

SERVICE_DISPATCHER(Loader)
  SERVICE_INTERFACES_REGISTER_DISPATCH
  SERVICE_METHOD_REGISTER(exit)
SERVICE_DISPATCHER_END

SERVICE_METHOD_DEFINITION(Loader, create)
{
  const char *name = params;
  Sequence srv_params = params;
  srv_params = 0;
  // TODO: names starting with '.' are ufn and may refer to another pc, without the dot are strictly local...better convention must be decided!!!
  if(name[0] != '.')
  {
    debug_line
    return dlm::i().create(params, &srv_params); // params = srv name + subseqs representing params acquired via command line and to be given to the srv => name must be removed
//    return *((Service*) new ServiceLoader(params, &srv_params)); // params = srv name + subseqs representing params acquired via command line and to be given to the srv => name must be removed
  }
  else
  {
    debug_line
//    Sequence key = rk->create(params);
//    Service* srv = new ServiceClient(key);
//    return *srv;
    Sequence kkey = generateKey();
    Sequence skey = generateKey();
    new ServiceServer(*this, kkey); // todo: manage through an instance manager...
//    std::string name = (const char*) params;
    std::string name = ((const char*) params) + 1;
    std::string key1 = (char*) kkey;
    std::string key2 = (char*) skey;
    std::string cmd = "./process " + name + " 1 \"" + key1 + "\"" + " 1 \"" + key2 + "\"";
    systemLaunch(cmd.c_str());
    // create a new lock
    // lock it
    // store in map <kkey, lock>
    // lock wait
    Lock* l = new Lock();
    l->lock();
    lm[(char*) kkey] = l;
    l->waitunlock();
    delete l;
    // wait for connect back and reply with ipc key, send key to caller as result...this avoids synchronization
    return *(new ServiceClient(skey));
  }
}

SERVICE_METHOD_DEFINITION(Loader, destroy)
{
  dlm::i().destroy(params);
  return SERVICE_NULL;
}

SERVICE_METHOD_DEFINITION(Loader, exit)
{
  prclck::i().unlock();
  return SERVICE_NULL;
}

SERVICE_METHOD_DEFINITION(Loader, notify)
{
  // get from map <kkey, lock>
  // unlock it
  // unmap it
  debug_line
  Lock* l = lm[(const char*) params];
  l->unlock();
  lm[(const char*) params] = 0;
  debug_line
  return SERVICE_NULL;
}

Sequence Loader::create(const Sequence& name, SERVICE_METHOD_PARAMETERS)
{
  return ServiceSequence(name, params);
//  // TODO: names starting with '.' are ufn and may refer to another pc, without the dot are strictly local...better convention must be decided!!!
//  if(((const char*) name)[0] != '.')
//  {
//    debug_line
////    return dlm::i().create(params, &srv_params); // params = srv name + subseqs representing params acquired via command line and to be given to the srv => name must be removed
//    return new ServiceLoader(name, params); // params = srv name + subseqs representing params acquired via command line and to be given to the srv => name must be removed
//  }
//  else
//  {
//    debug_line
////    Sequence key = rk->create(params);
////    Service* srv = new ServiceClient(key);
////    return *srv;
//    Sequence kkey = generateKey();
//    Sequence skey = generateKey();
//    new ServiceServer(*this, kkey); // todo: manage through an instance manager...
////    std::string name = (const char*) params;
//    std::string name = ((const char*) params) + 1;
//    std::string key1 = (char*) kkey;
//    std::string key2 = (char*) skey;
//    std::string cmd = "./process " + name + " 1 \"" + key1 + "\"" + " 1 \"" + key2 + "\"";
//    systemLaunch(cmd.c_str());
//    // create a new lock
//    // lock it
//    // store in map <kkey, lock>
//    // lock wait
//    Lock* l = new Lock();
//    l->lock();
//    lm[(char*) kkey] = l;
//    l->waitunlock();
//    delete l;
//    // wait for connect back and reply with ipc key, send key to caller as result...this avoids synchronization
//    return new ServiceClient(skey);
//  }
}
