#include "simple.h"

Simple::Simple(Service* k)
{
  debug("[Simple::Simple]")
}

Simple::~Simple()
{
  debug("[Simple::~Simple]")
}

SERVICE_METHOD_DISPATCHER(Simple)
  debug("[Simple::f]")
  SERVICE_REGISTER_METHOD_BY_NAME(test1)
  SERVICE_REGISTER_METHOD_BY_NAME(test2)
SERVICE_METHOD_DISPATCHER_END
