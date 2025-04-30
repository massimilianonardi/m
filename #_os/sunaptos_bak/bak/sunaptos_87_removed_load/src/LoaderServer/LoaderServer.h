#ifndef LOADERSERVER_H
#define	LOADERSERVER_H

#include "service.h"
#include "ServiceLoader.h"

class LoaderServer: virtual public Service
{
public:
  LoaderServer(SERVICE_METHOD_PARAMETERS);
  virtual ~LoaderServer();

  SERVICE_DECLARATIONS
//  SERVICE_METHOD_DECLARATION(create)
//  SERVICE_METHOD_DECLARATION(destroy)
//  SERVICE_METHOD_DECLARATION(notify)
  SERVICE_METHOD_DECLARATION(stop)
private:
  sequence ssp;
  Service* ss;
  Service* sl;
  ServiceLoader* stream_dlib;
};

#endif	/* LOADERSERVER_H */
