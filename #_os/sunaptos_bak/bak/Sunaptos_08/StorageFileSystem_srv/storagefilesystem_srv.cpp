#include "storagefilesystem_srv.h"

StorageFileSystem_srv::StorageFileSystem_srv(StorageFileSystem* srv)
{
  this->srv = srv;
  // todo: if this->srv is null throw an exception
}

StorageFileSystem_srv::~StorageFileSystem_srv()
{
  // since the "srv" pointer was created outside, then it is appropriate and more robust to be deleted outside either
}

Sequence& StorageFileSystem_srv::processCommand(int cmd, Sequence& params, Sequence& res)
{
  switch(cmd)
  {
    case 1:
      return srv->filecreate(params, res);
      break;
    case 2:
      return srv->filedelete(params, res);
      break;
    case 3:
      return srv->filerename(params, res);
      break;
    default:
      // throw a "method not found" exception
      break;
  }
  // throw a "method not found" exception
}
