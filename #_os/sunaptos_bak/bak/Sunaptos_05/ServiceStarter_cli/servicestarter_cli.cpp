#include "servicestarter_cli.h"

ServiceStarter_cli::ServiceStarter_cli(CommandListener* cl)
{
  this->cl = cl;
  // todo: if this->cl is null throw an exception
}

ServiceStarter_cli::~ServiceStarter_cli()
{
}

Data* ServiceStarter_cli::createServiceChannel(Data* data)
{
  return cl->processCommand(1, data);
}
