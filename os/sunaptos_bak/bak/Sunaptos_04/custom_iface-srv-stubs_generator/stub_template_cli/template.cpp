#include "template_file_name_cli.h"

template_class_cli::template_class_cli(CommandListener* cl)
{
  this->cl = cl;
  // todo: if this->cl is null throw an exception
}

template_class_cli::~template_class_cli()
{
}

Data* template_class_cli::method_1(Data* data)
{
  return cl->processCommand(1, data);
}

Data* template_class_cli::method_2(Data* data)
{
  return cl->processCommand(2, data);
}

Data* template_class_cli::method_3(Data* data)
{
  return cl->processCommand(3, data);
}
