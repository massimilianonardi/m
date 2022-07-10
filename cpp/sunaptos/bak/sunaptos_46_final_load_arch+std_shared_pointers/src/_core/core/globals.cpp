#include "globals.h"

ServiceLoader loader_dlib("Loader");
Service& loader = *loader_dlib.create(0);

service_shared_pointer load(const Sequence& params)
{
  return service_shared_pointer((Service*) loader.create(params), [](Service* srv){loader.destroy(*srv);});
//  service_shared_pointer ssp((Service*) loader.create(params), [](Service* srv){loader.destroy(*srv);});
//  return ssp;
}

service_shared_pointer load(const Sequence& name, const Sequence& params)
{
  return load(Sequence(name) << params);
}
