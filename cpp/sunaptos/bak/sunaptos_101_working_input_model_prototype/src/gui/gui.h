#ifndef GUI_H
#define	GUI_H

#include "sunaptos.h"

class gui: virtual public service
{
protected:
  sequence input;
  sequence output;
  
public:
  gui(SERVICE_METHOD_PARAMETERS);
  virtual ~gui();
  
  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(start)
  SERVICE_METHOD_DECLARATION(stop)
  SERVICE_METHOD_DECLARATION(subscribe)
  SERVICE_METHOD_DECLARATION(unsubscribe)
  SERVICE_METHOD_DECLARATION(available)
  SERVICE_METHOD_DECLARATION(read)
  SERVICE_METHOD_DECLARATION(write)
};

#endif	/* GUI_H */
