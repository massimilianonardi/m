#include "globals.h"

#include "serviceloader.h"

ServiceLoader loader_dlib("Loader");
Service& loader = *loader_dlib.create(0);

service_shared_pointer load(const Sequence& params)
{
  return service_shared_pointer((Service*) loader.create(params), [](Service* srv){loader.destroy(*srv);});
}

service_shared_pointer load(const Sequence& name, const Sequence& params)
{
  // TODO: runtime sequence structure and Loader params structure
  return load(Sequence(name) << params);
}

void process_lock()
{
  // TODO: locking mechanism handled by loader so that it can keep alive services or make them end
}

void process_unlock()
{
  // TODO: locking mechanism handled by loader so that it can keep alive services or make them end
}

void process_waitunlock()
{
  // TODO: locking mechanism handled by loader so that it can keep alive services or make them end
}
