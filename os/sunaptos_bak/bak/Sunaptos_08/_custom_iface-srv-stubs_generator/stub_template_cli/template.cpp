#include "template_file_name_cli.h"

template_class_cli::template_class_cli(CommandListener* cl)
{
  this->cl = cl;
  // todo: if this->cl is null throw an exception
}

template_class_cli::~template_class_cli()
{
}

Sequence& template_class_cli::method_1(Sequence& params, Sequence& res)
{
  return cl->processCommand(1, params, res);
}

Sequence& template_class_cli::method_2(Sequence& params, Sequence& res)
{
  return cl->processCommand(2, params, res);
}

Sequence& template_class_cli::method_3(Sequence& params, Sequence& res)
{
  return cl->processCommand(3, params, res);
}
