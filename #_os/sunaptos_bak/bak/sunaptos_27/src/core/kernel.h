#ifndef KERNEL_H
#define	KERNEL_H

#include "sequence.h"
#include "service.h"

class Kernel: virtual public Service
{
  protected:
    Service* rk;

  public:
//    enum {create = 0, destroy = 1, create_separate = 2, notify_startup = 3, create_remote = 4, exit_process = 99};
    enum
    {
      exit_process = -1,
      notify_startup = 0,
      destroy = 1,
      create = 2,
      create_separate = 3,
      create_remote = 4,
      reserved
    };

    Kernel(sequence& params);
    ~Kernel();

    sequence f(element i, sequence& params);
//    Service* getService(sequence& params);
//    sequence& delService(Service* srv);
//    bool setLoaderListener(const char* key);

    // todo: add a method to set/give "listeners" to active local/remote objs
    // todo: add a method to delete an active object via the loader
    // todo: add methods to create/delete data objects via the loader

  protected:
    sequence createLocal(sequence& params);
    sequence createSeparate(sequence& params);
    sequence createRemote(sequence& params);
//    Service* createService(sequence& params);
//    sequence& destroyService(Service* srv);
    // creates connection between srvs or loaders NB connections are services and will be into servicesmap???
//    void createConnection(sequence& params);
};

#endif	/* KERNEL_H */
