#include "Service.h"

#include "ServiceLoader.h"

ServiceLoader loader_dlib("Loader");
Service& loader = *loader_dlib.create(0);

//SERVICE_DISPATCHER_DEFINITION(Service)
//{
//  return SERVICE_NULL;
//}

//SERVICE_DISPATCHER(Service)
//SERVICE_DISPATCHER_END
