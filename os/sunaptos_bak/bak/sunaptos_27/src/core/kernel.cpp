#include "sunaptos.h"

Kernel::Kernel(sequence& params): rk(0)
{
  try_managed
  debug("[Kernel::Kernel 00]")
  debug("[Kernel::Kernel 00] " << params(0) << " " << params(1) << " " << params(2) << " " << params(3) << " " << params(4) << " " << params(5))
  // create a client ipc connection to calling loader if requested from params if any
  if(strcmp(params(2), "0"))
  {
    rk = new ServiceClient(params(3));
  }
  debug("[Kernel::Kernel 01]")

  // create srv from params
  Service* srv = dlm::i().create(params(1), this);
  debug("[Kernel::Kernel 02]")

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
  catch_managed("Kernel::Kernel")
  rethrow_managed
  exit_try_catch_managed
}

Kernel::~Kernel()
{
  debug("[Kernel::~Kernel 00]")
  // todo: delete all objects
  delete rk;
  debug("[Kernel::~Kernel 99]")
}

sequence Kernel::f(element i, sequence& params)
{
//  debug("[Kernel::f 00]")
//  debug("[Kernel::f 00] i = " << (long) i << " - params = " << (char*) params)
  sequence res;
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
      res << dlm::i().destroy(params.get(0));
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
      sequence e;
      e << i;
      e << new sequence(params);
      throw e;
      break;
  }

//  debug("[Kernel::f 99]")
  return res;
}

sequence Kernel::createLocal(sequence& params)
{
  try_managed
//  debug("[Kernel::create 00]")
  sequence res;
  Service* srv = dlm::i().create(params, this);
  res = sequence();
  res.ins(srv);
  debug("[Kernel::create 99]")
  return res;
  catch_managed("Kernel::create")
  rethrow_managed
  exit_try_catch_managed
}

sequence Kernel::createSeparate(sequence& params)
{
  try_managed
//  debug("[Kernel::createSeparate 00]")
  sequence res;
  res = rk->f(Kernel::create_separate, params);
  Service* rsrv = new ServiceClient(res);
  // todo: create an instance manager and add pointer to it
  res = sequence();
//  res = (element) 0;
  res << (long) rsrv;
//  res = (long) rsrv;
//  res.ins<long>((long) rsrv);
  debug("[Kernel::createSeparate 99]")
  return res;
  catch_managed("Kernel::createSeparate")
  rethrow_managed
  exit_try_catch_managed
}

sequence Kernel::createRemote(sequence& params)
{
  try_managed
  debug("[Kernel::createRemote 00]")
  sequence res;
  debug("[Kernel::createRemote 99]")
  return res;
  catch_managed("Kernel::createRemote")
  rethrow_managed
  exit_try_catch_managed
}
