#include <memory>

#include "service.h"
#include "sequence.h"

typedef std::shared_ptr<Service> service_shared_pointer;

extern Service& loader;
service_shared_pointer load(const Sequence& params);
service_shared_pointer load(const Sequence& name, const Sequence& params);
void process_lock();
void process_unlock();
void process_waitunlock();
