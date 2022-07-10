#include "storage_cli.h"

Storage_cli::Storage_cli(CommandListener* cl)
{
  this->cl = cl;
  // todo: if this->cl is null throw an exception
}

Storage_cli::~Storage_cli()
{
}

Sequence& Storage_cli::storagesequencespace(Sequence& params, Sequence& res)
{
  return cl->processCommand(1, params, res);
}

Sequence& Storage_cli::storagesequence(Sequence& params, Sequence& res)
{
  return cl->processCommand(2, params, res);
}

Sequence& Storage_cli::create(Sequence& params, Sequence& res)
{
  return cl->processCommand(3, params, res);
}

Sequence& Storage_cli::modify(Sequence& params, Sequence& res)
{
  return cl->processCommand(4, params, res);
}

Sequence& Storage_cli::get(Sequence& params, Sequence& res)
{
  return cl->processCommand(5, params, res);
}

Sequence& Storage_cli::set(Sequence& params, Sequence& res)
{
  return cl->processCommand(6, params, res);
}

Sequence& Storage_cli::ins(Sequence& params, Sequence& res)
{
  return cl->processCommand(7, params, res);
}

Sequence& Storage_cli::del(Sequence& params, Sequence& res)
{
  return cl->processCommand(8, params, res);
}
