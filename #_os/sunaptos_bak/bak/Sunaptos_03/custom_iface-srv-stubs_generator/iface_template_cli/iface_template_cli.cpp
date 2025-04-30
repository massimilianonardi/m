#include "iface_template_cli.h"

iface_template_cli::iface_template_cli(CommandListener* cl)
{
  this->cl = cl;
  // todo: if this->cl is null throw an exception
}

iface_template_cli::~iface_template_cli()
{
}

Data* iface_template_cli::method_1(Data* data)
{
  return cl->processCommand(1, data);
}

Data* iface_template_cli::method_2(Data* data)
{
  return cl->processCommand(2, data);
}

Data* iface_template_cli::method_3(Data* data)
{
  return cl->processCommand(3, data);
}
