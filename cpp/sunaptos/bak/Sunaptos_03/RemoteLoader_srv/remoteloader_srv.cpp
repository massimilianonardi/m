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

Data* RemoteLoader_srv::processCommand(int cmd, Data* msg)
{
  switch(cmd)
  {
    case 1:
      return srv->getInterface(msg);
      break;
    case 2:
      return srv->getService(msg);
      break;
    default:
      // throw a "method not found" exception
      break;
  }
  // throw a "method not found" exception
}
