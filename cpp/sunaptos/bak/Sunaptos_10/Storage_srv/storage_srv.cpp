#include "storage_srv.h"

Storage_srv::Storage_srv(Storage* srv)
{
  this->srv = srv;
  // todo: if this->srv is null throw an exception
}

Storage_srv::~Storage_srv()
{
  // since the "srv" pointer was created outside, then it is appropriate and more robust to be deleted outside either
}

Sequence& Storage_srv::processCommand(int cmd, Sequence& params, Sequence& res)
{
  switch(cmd)
  {
    case 1:
      return srv->storagesequencespace(params, res);
      break;
    case 2:
      return srv->storagesequence(params, res);
      break;
    case 3:
      return srv->create(params, res);
      break;
    case 4:
      return srv->modify(params, res);
      break;
    case 5:
      return srv->get(params, res);
      break;
    case 6:
      return srv->set(params, res);
      break;
    case 7:
      return srv->ins(params, res);
      break;
    case 8:
      return srv->del(params, res);
      break;
    default:
      // throw a "method not found" exception
      break;
  }
  // throw a "method not found" exception
}
