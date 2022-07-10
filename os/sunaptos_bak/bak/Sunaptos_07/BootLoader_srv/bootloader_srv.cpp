#include "bootloader_srv.h"

BootLoader_srv::BootLoader_srv(BootLoader* srv)
{
  this->srv = srv;
  // todo: if this->srv is null throw an exception
}

BootLoader_srv::~BootLoader_srv()
{
  // since the "srv" pointer was created outside, then it is appropriate and more robust to be deleted outside either
}

Sequence& BootLoader_srv::processCommand(int cmd, Sequence& params, Sequence& res)
{
  switch(cmd)
  {
    case 1:
      return srv->boot(params, res);
      break;
    default:
      // throw a "method not found" exception
      break;
  }
  // throw a "method not found" exception
}
