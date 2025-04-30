#ifndef LOADERSERVER_H
#define	LOADERSERVER_H

#include "sunaptos.h"

#include "serviceserver.h"

class LoaderServer: virtual public Service
{
public:
  LoaderServer(SERVICE_METHOD_PARAMETERS);
  virtual ~LoaderServer();

  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
  SERVICE_METHOD_DECLARATION(notify)
private:
//  Service& srv;
//  Sequence srv_seq;
  service_shared_pointer ssp;
  ServiceServer* ss;
};

#endif	/* LOADERSERVER_H */
