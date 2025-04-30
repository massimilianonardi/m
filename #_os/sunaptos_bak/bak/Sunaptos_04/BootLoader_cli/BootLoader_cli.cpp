#include "BootLoader_cli.h"

BootLoader_cli::BootLoader_cli(CommandListener* cl)
{
  this->cl = cl;
  // todo: if this->cl is null throw an exception
}

BootLoader_cli::~BootLoader_cli()
{
}

Data* BootLoader_cli::boot(Data* data)
{
  return cl->processCommand(1, data);
}
