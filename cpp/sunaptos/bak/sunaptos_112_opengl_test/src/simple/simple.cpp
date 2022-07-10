#include "simple.h"

SERVICE_EXPORT(Simple)

Simple::Simple(SERVICE_METHOD_PARAMETERS)
{
  debug("[Simple::Simple]")
}

Simple::~Simple()
{
  debug("[Simple::~Simple]")
}

SERVICE_METHOD_DEFINITION(Simple, get)
{
  debug("Simple get start ok! params: " << params.to_string())
  sequence r;
  sequence l = "linked";
  r.links_resize(2);
  r(0) = "command_00";
  r(0).links_ins("param_00_01");
  r(0).links_ins("param_00_02");
  r(0).links_ins("param_00_03");
  r(0).links_ins(&l);
  r(0)(0) = &l;
  r(1) = "command_01";
  r(1).links_ins("param_01_01");
  r(1).links_ins("param_01_02");
  r(1).links_ins("param_01_03");
  r(1).links_ins(&l);
  r(1)(0) = &l;
  l = "modified!!!";
  return r;
}

SERVICE_METHOD_DEFINITION(Simple, create)
{
  debug("Simple create ok! params: " << params.to_string())
  return "Simple create ok!";
}

SERVICE_METHOD_DEFINITION(Simple, destroy)
{
  debug("Simple destroy ok! params: " << params.to_string())
  return "Simple destroy ok!";
}

SERVICE_DISPATCHER_EXPAND(Simple)
//  SERVICE_METHOD_REGISTER(create)
  SERVICE_METHOD_REGISTER(test1)
  SERVICE_METHOD_REGISTER(test2)
SERVICE_DISPATCHER_END
