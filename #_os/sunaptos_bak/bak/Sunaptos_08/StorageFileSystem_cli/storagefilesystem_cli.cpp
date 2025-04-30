#include "storagefilesystem_cli.h"

StorageFileSystem_cli::StorageFileSystem_cli(CommandListener* cl)
{
  this->cl = cl;
  // todo: if this->cl is null throw an exception
}

StorageFileSystem_cli::~StorageFileSystem_cli()
{
}

Sequence& StorageFileSystem_cli::filecreate(Sequence& params, Sequence& res)
{
  return cl->processCommand(1, params, res);
}

Sequence& StorageFileSystem_cli::filedelete(Sequence& params, Sequence& res)
{
  return cl->processCommand(2, params, res);
}

Sequence& StorageFileSystem_cli::filerename(Sequence& params, Sequence& res)
{
  return cl->processCommand(3, params, res);
}
