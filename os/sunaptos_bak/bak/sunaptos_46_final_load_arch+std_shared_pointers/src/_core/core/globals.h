#include <memory>

#include "service.h"
#include "serviceloader.h"
#include "sequence.h"

typedef std::shared_ptr<Service> service_shared_pointer;

extern ServiceLoader loader_dlib;
extern Service& loader;

service_shared_pointer load(const Sequence& params);
service_shared_pointer load(const Sequence& name, const Sequence& params);
