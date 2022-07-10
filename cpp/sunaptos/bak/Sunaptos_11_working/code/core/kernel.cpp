#include "kernel.h"
#include "singletons.h"
#include "dynamiclibrarymanager.h"
#include "serviceserver.h"
#include "serviceclient.h"
#include <iostream>

Kernel::Kernel(Sequence& params): rk(0)
{
  // create a client ipc connection to calling loader if requested from params if any
  if(params(1)[0])
  {
    rk = new ServiceClient(params(1)(1));
  }

  // create srv from params
  Service* srv = dlm::instance().create(params(0), this);

  // create a server ipc connection from params if requested
  if(params(2)[0])
  {
    // todo: create an instance manager and add pointer to it
    new ServiceServer(srv, params(2)(1));
  }
}

Kernel::~Kernel()
{
  // todo: delete all objects
  delete rk;
}

Sequence Kernel::f(number i, Sequence& params)
{
  Sequence res;
  std::cout << "\n[Kernel::f 00] ";
  std::cout << (long) i << " " << (char*) params;
  // todo: a real instancemanager now only creation is supported, no maps no storing pointers...
  switch((long) i)
  {
    case create:
      // create
      Service* srv = dlm::instance().create(params, this);
      res = Sequence();
//      res << (long) srv;
//      res << (number)(long) srv << 5;
//      params = Sequence();
//      params << (long) srv;
//      params << 5;
      res.ins<Sequence*>(reinterpret_cast<Sequence*>(srv), 0);
      std::cout << (long) srv << " " << (long) res[0];
      break;

    case destroy:
      // destroy
      res << dlm::instance().destroy(params.get<Service*>(0));
      break;

    case create_separate:
      // create separate
      std::cout << "\n[Kernel::f 01]\n";
      res = rk->f(Kernel::create_separate, params);
      std::cout << "\n[Kernel::f 02]\n";
      Service* rsrv = new ServiceClient(res);
      std::cout << "\n[Kernel::f 03]\n";
      // todo: create an instance manager and add pointer to it
      res = Sequence();
      res << (long) rsrv;
//      std::cout << (long) rsrv << " " << (long) res[0];
      std::cout << "\n[Kernel::f 04]\n";
      break;

    default:
      // error! function not supported!!!
      break;
  }

//  std::cout << (long) res[0];
  std::cout << "\n[Kernel::f 99]\n";
  return res;
}
