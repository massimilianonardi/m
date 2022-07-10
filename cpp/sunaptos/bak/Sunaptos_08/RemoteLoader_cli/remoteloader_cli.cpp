#include "remoteloader_cli.h"

RemoteLoader_cli::RemoteLoader_cli(CommandListener* cl)
{
  this->cl = cl;
  // todo: if this->cl is null throw an exception
}

RemoteLoader_cli::~RemoteLoader_cli()
{
}

Sequence& RemoteLoader_cli::getInterface(Sequence& params, Sequence& res)
{
  return cl->processCommand(1, params, res);
}

Sequence& RemoteLoader_cli::getService(Sequence& params, Sequence& res)
{
  return cl->processCommand(2, params, res);
}

Sequence& RemoteLoader_cli::setLoaderListener(Sequence& params, Sequence& res)
{
  return cl->processCommand(3, params, res);
}
