#include "service.h"

#include "ServiceLoader.h"

ServiceLoader loader_dlib("Loader");
service& loader = *loader_dlib.create(0);

SERVICE_DISPATCHER(service)
SERVICE_INTERFACES_REGISTER_DISPATCH
SERVICE_DISPATCHER_END
