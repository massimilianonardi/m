#include "kernel.h"

#include <cstring>

#include "serviceclient.h"
#include "serviceserver.h"
#include "singletons.h"
#include "debug.h"

Kernel::Kernel(Sequence& params): rk(0)
{
  debug("[Kernel::Kernel 00]")
  debug("[Kernel::Kernel 00] params: " << (char*) params(0) << " " << (char*) params(1) << " " << (char*) params(2) << " " << (char*) params(3) << " " << (char*) params(4) << " " << (char*) params(5) << " ")
  // create a client ipc connection to calling loader if requested from params if any
  if(strcmp(params(2), "0"))
  {
    rk = new ServiceClient(params(3));
  }
  debug("[Kernel::Kernel 01]")

  // create srv from params
  Service* srv = dlm::i().create(params(1), this);
  debug("[Kernel::Kernel 02]" << (long) srv)

  // create a server ipc connection from params if requested
  if(strcmp(params(4), "0"))
  {
    // todo: create an instance manager and add pointer to it
    new ServiceServer(srv, params(5));
  }
  debug("[Kernel::Kernel 03]")

  // todo: notify calling loader of successful startup
  if(rk)
  {
    rk->f(Kernel::notify_startup, params(3));
  }
  debug("[Kernel::Kernel 99]")
}

Kernel::~Kernel()
{
  debug("[Kernel::~Kernel 00]")
  // todo: delete all objects
  delete rk;
  debug("[Kernel::~Kernel 99]")
}

Sequence Kernel::f(number i, Sequence& params)
{
//  debug("[Kernel::f 00]")
//  debug("[Kernel::f 00] i = " << (long) i << " - params = " << (char*) params)
  Sequence res;
  // todo: a real instancemanager now only creation is supported, no maps no storing pointers...
  switch((long) i)
  {
    case exit_process:
      prclck::i().unlock();
      break;

    case notify_startup:
      // not used here, enum value is only for KernelMaster
      break;

    case destroy:
//      res << dlm::i().destroy(params.get<Service*>(0));
      res << dlm::i().destroy(params);
      break;

    case create:
      res = createLocal(params);
      break;

    case create_separate:
      res = createSeparate(params);
      break;

    case create_remote:
      res = createRemote(params);
      break;

    default:
      debug("[Kernel::f 01]")
      Sequence e;
      e << i;
      e << new Sequence(params);
      throw e;
      break;
  }

//  debug("[Kernel::f 99]")
  return res;
}

Sequence Kernel::createLocal(Sequence& params)
{
//  debug("[Kernel::create 00]")
  Sequence res;
  Service* srv = dlm::i().create(params, this);
  debug("[Kernel::create 01] srv=" << (long) srv)
  res = Sequence();
//  res.ins<Sequence*>(reinterpret_cast<Sequence*>(srv), 0);
  res = srv;
  debug("[Kernel::create 02] srv=" << (long) res)
//  res = (long long) srv;
//  res << (long) srv;
//  res << Sequence(srv);
  debug("[Kernel::create 99]")
  return res;
}

Sequence Kernel::createSeparate(Sequence& params)
{
//  debug("[Kernel::createSeparate 00]")
  Sequence res;
  res = rk->f(Kernel::create_separate, params);
  Service* rsrv = new ServiceClient(res);
  // todo: create an instance manager and add pointer to it
  res = Sequence();
//  res = (number) 0;
//  res << (long) rsrv;
  res = rsrv;
//  res = (long) rsrv;
//  res.ins<long>((long) rsrv);
  debug("[Kernel::createSeparate 99]")
  return res;
}

Sequence Kernel::createRemote(Sequence& params)
{
  debug("[Kernel::createRemote 00]")
  Sequence res;
  debug("[Kernel::createRemote 99]")
  return res;
}
