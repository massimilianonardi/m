#include "servicestarter_cli.h"

ServiceStarter_cli::ServiceStarter_cli(CommandListener* cl)
{
  this->cl = cl;
  // todo: if this->cl is null throw an exception
}

ServiceStarter_cli::~ServiceStarter_cli()
{
}

Sequence& ServiceStarter_cli::method_1(Sequence& params, Sequence& res)
{
  return cl->processCommand(1, params, res);
}

Sequence& ServiceStarter_cli::method_2(Sequence& params, Sequence& res)
{
  return cl->processCommand(2, params, res);
}

Sequence& ServiceStarter_cli::method_3(Sequence& params, Sequence& res)
{
  return cl->processCommand(3, params, res);
}
