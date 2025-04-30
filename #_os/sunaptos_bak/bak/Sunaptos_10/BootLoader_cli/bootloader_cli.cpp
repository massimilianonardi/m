#include "bootloader_cli.h"

BootLoader_cli::BootLoader_cli(CommandListener* cl)
{
  this->cl = cl;
  // todo: if this->cl is null throw an exception
}

BootLoader_cli::~BootLoader_cli()
{
}

Sequence& BootLoader_cli::boot(Sequence& params, Sequence& res)
{
  return cl->processCommand(1, params, res);
}
