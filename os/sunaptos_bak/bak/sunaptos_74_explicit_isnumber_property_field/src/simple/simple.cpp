#include "simple.h"

Simple::Simple(SERVICE_METHOD_PARAMETERS)
{
  debug("[Simple::Simple]")
}

Simple::~Simple()
{
  debug("[Simple::~Simple]")
}

SERVICE_METHOD_DEFINITION(Simple, create)
{
  debug("Simple create ok! params: " << params.text())
  return "Simple create ok!";
}

SERVICE_METHOD_DEFINITION(Simple, destroy)
{
  debug("Simple destroy ok! params: " << params.text())
  return "Simple destroy ok!";
}

SERVICE_REGISTER(Simple)
//  SERVICE_METHOD_REGISTER(create)
  SERVICE_METHOD_REGISTER(test1)
  SERVICE_METHOD_REGISTER(test2)
SERVICE_REGISTER_END
