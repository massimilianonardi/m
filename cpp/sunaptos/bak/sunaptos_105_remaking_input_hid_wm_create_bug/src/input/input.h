#ifndef INPUT_H
#define	INPUT_H

#include "sunaptos.h"

class input: virtual public stream
{
protected:
  sequence devices;
  bool check(const sequence& filter, const sequence& params);
  
public:
  input(SERVICE_METHOD_PARAMETERS);
  virtual ~input();
  
//  SERVICE_METHOD_DECLARATION(subscribe)
//  SERVICE_METHOD_DECLARATION(unsubscribe)
  SERVICE_METHOD_DECLARATION(write)
  
  void runloop();
};

#endif	/* INPUT_H */
