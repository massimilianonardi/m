#include "kernel.h"
#include "singletons.h"
#include "dynamiclibrarymanager.h"
#include "serviceserver.h"
#include "serviceclient.h"
#include <iostream>

Kernel::Kernel(Sequence& params)
{
  std::cout << "\n[Kernel 00]\n";
  std::cout << "\n[Kernel 00]\n" << params(0)(0).size();
  std::cout << "\n[Kernel 00]\n" << (char*) params(0)(0);
  std::cout << "\n[Kernel 00]\n" << (char*) params(0)(1);
  std::cout << "\n[Kernel 00]\n" << (char*) params(1);
  std::cout << "\n[Kernel 00]\n" << (char*) params(2)(0);
  std::cout << "\n[Kernel 00]\n" << (char*) params(2)(1);
  std::cout << "\n[Kernel 01]\n";
  // create a client ipc connection to calling loader if requested from params if any
  if(params(0)(0).size() > 2)
  {
    new ServiceClient(params(0)(1));
  }

  std::cout << "\n[Kernel 02]\n";
  // create srv from params
  Service* srv = dlm::instance().create(params(1), this);

  std::cout << "\n[Kernel 03]\n";
  // create a server ipc connection from params if requested
  if(params(2)(0).size() > 2)
  {
    new ServiceServer(srv, params(2)(1));
  }
  std::cout << "\n[Kernel 04]\n";
}

Kernel::~Kernel()
{
}

Sequence& Kernel::f(number i, Sequence& params, Sequence& res)
{
  std::cout << "\n[Kernel::f 00]\n";
  std::cout << (long) i << (char*) params;
  std::cout << "\n[Kernel::f 01]\n";
  // todo: a real instancemanager now only creation is supported, no maps no storing pointers...
  switch((long) i)
  {
    case create:
      // create
      Service* srv = dlm::instance().create(params, this);
      res << (long) srv;
      break;

    case destroy:
      // destroy
      res << dlm::instance().destroy(params.get<Service*>(0));
      break;

    default:
      // error! function not supported!!!
      break;
  }

  std::cout << "\n[Kernel::f 99]\n";
  return res;
}
