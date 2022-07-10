#include "servicestarter_srv.h"

ServiceStarter_srv::ServiceStarter_srv(ServiceStarter* srv)
{
  this->srv = srv;
  // todo: if this->srv is null throw an exception
}

ServiceStarter_srv::~ServiceStarter_srv()
{
  // since the "srv" pointer was created outside, then it is appropriate and more robust to be deleted outside either
}

Sequence& ServiceStarter_srv::processCommand(int cmd, Sequence& params, Sequence& res)
{
  switch(cmd)
  {
    case 1:
      return srv->createServiceChannel(params, res);
      break;
    default:
      // throw a "method not found" exception
      break;
  }
  // throw a "method not found" exception
}
