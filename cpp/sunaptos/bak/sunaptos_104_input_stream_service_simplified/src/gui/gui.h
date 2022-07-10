#ifndef GUI_H
#define	GUI_H

#include "sunaptos.h"

class gui: virtual public stream
{
protected:
  sequence input;
  sequence output;
  
public:
  gui(SERVICE_METHOD_PARAMETERS);
  virtual ~gui();
  
  SERVICE_METHOD_DECLARATION(write)
};

#endif	/* GUI_H */
