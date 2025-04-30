#ifndef STREAM_H
#define	STREAM_H

#include "sequence.h"
#include "service.h"

class stream: virtual public service
{
protected:
  sequence ostreams;
  
public:
  virtual ~stream();
  
  SERVICE_METHOD_DECLARATION(subscribe)
  SERVICE_METHOD_DECLARATION(unsubscribe)
  SERVICE_METHOD_DECLARATION(write)
};

#endif	/* STREAM_H */
