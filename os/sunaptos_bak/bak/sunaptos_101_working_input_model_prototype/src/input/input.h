#ifndef INPUT_H
#define	INPUT_H

#include "sunaptos.h"

class input: virtual public service
{
protected:
  sequence devices;
  sequence ostreams;
  bool check(const sequence& filter, const sequence& params);
  
public:
  input(SERVICE_METHOD_PARAMETERS);
  virtual ~input();
  
  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(start)
  SERVICE_METHOD_DECLARATION(stop)
  SERVICE_METHOD_DECLARATION(subscribe)
  SERVICE_METHOD_DECLARATION(unsubscribe)
  SERVICE_METHOD_DECLARATION(available)
  SERVICE_METHOD_DECLARATION(read)
  SERVICE_METHOD_DECLARATION(write)
  
  void runloop();
};

#endif	/* INPUT_H */
