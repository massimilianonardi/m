#include "kernel.h"

#include <cstring>

#include "serviceclient.h"
#include "serviceserver.h"
#include "singletons.h"
#include "exception.h"
#include "debug.h"

Kernel::Kernel(Sequence& params): rk(0)
{
  exception_try
//  debug("[Kernel::Kernel 00]")
//  debug("[Kernel::Kernel 00] params: " << (char*) params(0) << " " << (char*) params(1) << " " << (char*) params(2) << " " << (char*) params(3) << " " << (char*) params(4) << " " << (char*) params(5) << " ")
  // create a client ipc connection to calling loader if requested from params if any
  if(strcmp(params(2), "0"))
  {
    rk = new ServiceClient(params(3));
  }
//  debug("[Kernel::Kernel 01]")

  // create srv from params
  Service& srv = dlm::i().create(params(1), this);
//  debug("[Kernel::Kernel 02]")

  // create a server ipc connection from params if requested
  if(strcmp(params(4), "0"))
  {
    // todo: create an instance manager and add pointer to it
    new ServiceServer(srv, params(5));
  }
//  debug("[Kernel::Kernel 03]")

  // todo: notify calling loader of successful startup
  if(rk)
  {
//    Sequence seq;
//    rk->f(seq = Kernel::notify_startup, params(3));
//    rk->f2(Kernel::notify_startup, params(3));
//    rk->f("notifyStartup", params(3));
//    rk->f(Kernel::notify_startup, params(3));
    rk->notify(params(3));
  }
//  debug("[Kernel::Kernel 99]")
  exception_catch_print
  exception_end
}

Kernel::~Kernel()
{
  debug("[Kernel::~Kernel 00]")
  // todo: delete all objects
  delete rk;
  debug("[Kernel::~Kernel 99]")
}

SERVICE_DISPATCHER(Kernel)
  SERVICE_METHOD_REGISTER_BY_ID_BEGIN
  SERVICE_METHOD_REGISTER_BY_ID_EXPLICIT(Kernel::exit_process, exitProcess)
  SERVICE_METHOD_REGISTER_BY_ID_EXPLICIT(Kernel::notify_startup, 0;)
  SERVICE_METHOD_REGISTER_BY_ID_EXPLICIT(Kernel::destroy_local, dlm::i().destroy)
  SERVICE_METHOD_REGISTER_BY_ID_EXPLICIT(Kernel::create_local, createLocal)
  SERVICE_METHOD_REGISTER_BY_ID_EXPLICIT(Kernel::create_separate, createSeparate)
  SERVICE_METHOD_REGISTER_BY_ID_EXPLICIT(Kernel::create_remote, createRemote)
  SERVICE_METHOD_REGISTER_BY_ID_END
SERVICE_DISPATCHER_END
//    case exit_process:
//      prclck::i().unlock();
//      break;
//
//    case notify_startup:
//      // not used here, enum value is only for KernelMaster
//      break;
//
//    case destroy:
////      res << dlm::i().destroy(params.get<Service*>(0));
//      res << dlm::i().destroy(params);
//      break;

Sequence Kernel::exitProcess(const Sequence& params)
{
  prclck::i().unlock();
  return 0;
}

Sequence Kernel::createLocal(const Sequence& params)
{
  return dlm::i().create(params, this);
}

Sequence Kernel::createSeparate(const Sequence& params)
{
//  Sequence key = rk->f(Kernel::create_separate, params);
  Sequence key = rk->create(params);
  Service* srv = new ServiceClient(key);
  return *srv;
}

Sequence Kernel::createRemote(const Sequence& params)
{
  debug("[Kernel::createRemote 00]")
  Sequence res;
  debug("[Kernel::createRemote 99]")
  return res;
}
