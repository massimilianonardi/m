#ifndef KERNEL_H
#define	KERNEL_H

#include "service.h"
#include "sequence.h"
//#include "number.h"

class Kernel: virtual public Service
{
  protected:
    Service* rk;

  public:
//    enum {create = 0, destroy = 1, create_separate = 2, notify_startup = 3, create_remote = 4, exit_process = 99};
    enum
    {
      exit_process = -100,
      notify_startup = 100,
      destroy_local = 101,
      create_local = 102,
      create_separate = 103,
      create_remote = 104,
      reserved
    };

    Kernel(Sequence& params);
    ~Kernel();

    SERVICE_DECLARATIONS
//    Sequence f(const Sequence& i, const Sequence& params);
//    Service* getService(Sequence& params);
//    Sequence& delService(Service* srv);
//    bool setLoaderListener(const char* key);

    // todo: add a method to set/give "listeners" to active local/remote objs
    // todo: add a method to delete an active object via the loader
    // todo: add methods to create/delete data objects via the loader

  protected:
    Sequence exitProcess(const Sequence& params);
    Sequence createLocal(const Sequence& params);
    Sequence createSeparate(const Sequence& params);
    Sequence createRemote(const Sequence& params);
//    Service* createService(Sequence& params);
//    Sequence& destroyService(Service* srv);
    // creates connection between srvs or loaders NB connections are services and will be into servicesmap???
//    void createConnection(Sequence& params);
};

#endif	/* KERNEL_H */
