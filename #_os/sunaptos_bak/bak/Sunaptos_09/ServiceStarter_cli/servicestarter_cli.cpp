#include "servicestarter_cli.h"

ServiceStarter_cli::ServiceStarter_cli(CommandListener* cl)
{
  this->cl = cl;
  // todo: if this->cl is null throw an exception
}

ServiceStarter_cli::~ServiceStarter_cli()
{
}

Sequence& ServiceStarter_cli::createServiceChannel(Sequence& params, Sequence& res)
{
  return cl->processCommand(1, params, res);
}
