#include "service.h"

#include "ServiceLoader.h"

ServiceLoader loader_dlib("Loader");
service& loader = *loader_dlib.create(0);

//SERVICE_DISPATCHER_DEFINITION(service)
//{
//  return SERVICE_NULL;
//}

//SERVICE_DISPATCHER(service)
//SERVICE_DISPATCHER_END
