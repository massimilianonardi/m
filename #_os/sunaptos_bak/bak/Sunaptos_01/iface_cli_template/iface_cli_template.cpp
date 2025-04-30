#include "iface_cli_template.h"

iface_cli_template::iface_cli_template(CommandListener* cl)
{
  this->cl = cl;
  // todo: if this->cl is null throw an exception
}

iface_cli_template::~iface_cli_template()
{
}

Data* iface_cli_template::method_1(Data* data)
{
  return cl->processCommand(1, data);
}

Data* iface_cli_template::method_2(Data* data)
{
  return cl->processCommand(2, data);
}

Data* iface_cli_template::method_3(Data* data)
{
  return cl->processCommand(3, data);
}
