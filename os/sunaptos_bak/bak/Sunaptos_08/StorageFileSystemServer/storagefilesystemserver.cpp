#include "storagefilesystemserver.h"
#include <iostream>

StorageFileSystemServer::StorageFileSystemServer(Loader* loader)
{
  std::cout << "\n[StorageFileSystemServer::StorageFileSystemServer] ";
}

StorageFileSystemServer::~StorageFileSystemServer()
{
  std::cout << "\n[StorageFileSystemServer::~StorageFileSystemServer] ";
}

Sequence& StorageFileSystemServer::filecreate(Sequence& params, Sequence& res)
{
  std::cout << "\n[StorageFileSystemServer::filecreate] ";
  return res;
}

Sequence& StorageFileSystemServer::filedelete(Sequence& params, Sequence& res)
{
  std::cout << "\n[StorageFileSystemServer::filedelete] ";
  return res;
}

Sequence& StorageFileSystemServer::filerename(Sequence& params, Sequence& res)
{
  std::cout << "\n[StorageFileSystemServer::filerename] ";
  return res;
}

Sequence& StorageFileSystemServer::setrootdir(Sequence& params, Sequence& res)
{
  std::cout << "\n[StorageFileSystemServer::setrootdir] ";
  rootdir = params;
  return res;
}
