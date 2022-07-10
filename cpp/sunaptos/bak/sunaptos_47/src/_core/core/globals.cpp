#include "globals.h"

#include "serviceloader.h"
#include "singletons.h"

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
  prclck::i().lock();
}

void process_unlock()
{
  prclck::i().unlock();
}

void process_waitunlock()
{
  prclck::i().waitunlock();
}
