#include "remoteloader_cli.h"

RemoteLoader_cli::RemoteLoader_cli(CommandListener* cl)
{
  this->cl = cl;
  // todo: if this->cl is null throw an exception
}

RemoteLoader_cli::~RemoteLoader_cli()
{
}

Data* RemoteLoader_cli::getInterface(Data* data)
{
  return cl->processCommand(1, data);
}

Data* RemoteLoader_cli::getService(Data* data)
{
  return cl->processCommand(2, data);
}

Data* RemoteLoader_cli::setLoaderListener(Data* data)
{
  return cl->processCommand(3, data);
}
