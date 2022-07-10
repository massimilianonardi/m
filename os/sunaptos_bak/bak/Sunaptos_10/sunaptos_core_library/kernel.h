#ifndef KERNEL_H
#define	KERNEL_H

#include "sequence.h"
#include "service.h"

class Kernel: virtual public Service
{
  public:
    enum {create = 0, destroy = 1};

    Kernel(Sequence& params);
    ~Kernel();

    Sequence& f(number i, Sequence& params, Sequence& res);
//    Service* getService(Sequence& params);
//    Sequence& delService(Service* srv);
//    bool setLoaderListener(const char* key);

    // todo: add a method to set/give "listeners" to active local/remote objs
    // todo: add a method to delete an active object via the loader
    // todo: add methods to create/delete data objects via the loader

  protected:
//    Service* createService(Sequence& params);
//    Sequence& destroyService(Service* srv);
    // creates connection between srvs or loaders NB connections are services and will be into servicesmap???
//    void createConnection(Sequence& params);
};

#endif	/* KERNEL_H */
