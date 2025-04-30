#include "ServiceExtern.h"

ServiceExtern::ServiceExtern(SERVICE_METHOD_PARAMETERS)
{
}

ServiceExtern::~ServiceExtern()
{
}

SERVICE_REGISTER(ServiceExtern)
SERVICE_REGISTER_END

SERVICE_METHOD_DEFINITION(ServiceExtern, create)
{
}

SERVICE_METHOD_DEFINITION(ServiceExtern, destroy)
{
}

SERVICE_METHOD_DEFINITION(ServiceExtern, notify)
{
}
