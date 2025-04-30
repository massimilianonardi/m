#include "remoteloader_srv.h"

RemoteLoader_srv::RemoteLoader_srv(RemoteLoader* srv)
{
  this->srv = srv;
  // todo: if this->srv is null throw an exception
}

RemoteLoader_srv::~RemoteLoader_srv()
{
  // since the "srv" pointer was created outside, then it is appropriate and more robust to be deleted outside either
}

Sequence& RemoteLoader_srv::processCommand(int cmd, Sequence& params, Sequence& res)
{
  switch(cmd)
  {
    case 1:
      return srv->getInterface(params, res);
      break;
    case 2:
      return srv->getService(params, res);
      break;
    case 3:
      return srv->setLoaderListener(params, res);
      break;
    default:
      // throw a "method not found" exception
      break;
  }
  // throw a "method not found" exception
}
